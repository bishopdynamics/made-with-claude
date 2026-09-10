import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, type DefaultTreeAdapterMap } from 'parse5';
import { checkSite } from '../scripts/check-site.mjs';
import { isolateFixtureCaches } from './fixtures/projects/build-cache.ts';
import {
  catalogLiteralTitle,
  catalogPublicationOrder,
  writeCatalogFixtures,
} from './fixtures/projects/catalog-fixtures.ts';
import type { ProjectSearchRecord } from '../src/types/projects.ts';
import { filterProjects } from '../src/lib/project-search.ts';

type Element = DefaultTreeAdapterMap['element'];
type Node = DefaultTreeAdapterMap['node'];
const attr = (element: Element, name: string) =>
  element.attrs.find((attribute) => attribute.name === name)?.value;
function elements(node: Node): Element[] {
  return [
    ...('tagName' in node ? [node] : []),
    ...('childNodes' in node ? node.childNodes.flatMap(elements) : []),
  ];
}
function text(node: Node): string {
  return 'value' in node
    ? node.value
    : 'childNodes' in node
      ? node.childNodes.map(text).join('')
      : '';
}
const marked = (nodes: Element[], name: string) =>
  nodes.filter((node) => attr(node, name) !== undefined);
const project = fileURLToPath(new URL('../', import.meta.url));

test(
  'actual homepage and catalog builds cover zero, single and six public projects without draft leakage',
  { timeout: 120_000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), 'hephaestion-catalog-'));
    t.after(() => rmSync(root, { recursive: true }));
    symlinkSync(
      join(project, 'node_modules'),
      join(root, 'node_modules'),
      'dir',
    );
    for (const file of [
      'package.json',
      'astro.config.mjs',
      'tsconfig.json',
      'src',
      'public',
      'scripts/markdown-code.mjs',
      'scripts/image-service.mjs',
    ]) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      cpSync(join(project, file), join(root, file), { recursive: true });
    }
    isolateFixtureCaches(root);
    for (const count of [6, 1, 0])
      await t.test(`${count} public projects`, async () => {
        const content = join(root, 'src/content/projects');
        if (existsSync(content)) rmSync(content, { recursive: true });
        const { entries, draftSlugs } = writeCatalogFixtures(root, { count });
        const expectedOrder = catalogPublicationOrder.filter((slug) =>
          entries.some((entry) => entry.id === slug),
        );
        const result = spawnSync(
          process.execPath,
          [join(project, 'scripts/astro.mjs'), 'build'],
          {
            cwd: root,
            encoding: 'utf8',
            env: {
              ...process.env,
              NODE_ENV: 'development',
              ASTRO_TELEMETRY_DISABLED: '1',
            },
            timeout: 30_000,
          },
        );
        assert.equal(result.error, undefined);
        assert.equal(result.status, 0, result.stdout + result.stderr);
        const directory = join(root, 'dist');
        await checkSite({
          directory,
          requiredRoutes: ['/', '/projects/', '/404.html'],
          publicProjectSlugs: expectedOrder,
          draftProjectSlugs: draftSlugs,
          requireProjectMedia: true,
          requireIndexability: true,
        });
        const home = elements(
          parse(readFileSync(join(directory, 'index.html'), 'utf8')),
        );
        const catalogPath = join(directory, 'projects/index.html');
        const catalogHtml = readFileSync(catalogPath, 'utf8');
        const catalog = elements(parse(catalogHtml));
        assert.equal(
          text(home.find((node) => node.tagName === 'h1')!),
          'What Claude/Codex Made',
        );
        assert.ok(
          home.some(
            (node) =>
              node.tagName === 'p' &&
              text(node) ===
                'Projects made by Claude and/or Codex, under the guidance of BishopDynamics.',
          ),
        );
        assert.equal(
          text(catalog.find((node) => node.tagName === 'h1')!),
          'All Projects',
        );
        const tiles = marked(home, 'data-project-tile');
        assert.deepEqual(
          tiles.map((node) => attr(node, 'data-project-slug')),
          expectedOrder.slice(0, 4),
        );
        if (count === 1)
          assert.match(
            attr(marked(home, 'data-home-projects')[0]!, 'class')!,
            /recent-projects-single/,
          );
        const cards = marked(catalog, 'data-project-card');
        assert.deepEqual(
          cards.map((node) => attr(node, 'data-project-slug')),
          expectedOrder,
        );
        for (const card of cards) {
          const entry = entries.find(
            ({ id }) => id === attr(card, 'data-project-slug'),
          )!;
          assert.match(
            text(card),
            entry.data.tags.includes('private') ? /Private/ : /Public/,
          );
        }
        for (const card of [...tiles, ...cards]) {
          assert.equal(card.tagName, 'a');
          assert.equal(
            attr(card, 'href'),
            `/projects/${attr(card, 'data-project-slug')}/`,
          );
          const children = elements(card);
          assert.equal(
            children.filter((node) => node.tagName === 'a').length,
            1,
            'A card has one full-card link',
          );
          assert.equal(
            children.filter((node) => node.tagName === 'button').length,
            0,
          );
          const image = children.find((node) => node.tagName === 'img')!;
          assert.ok(
            image &&
              attr(image, 'srcset') &&
              attr(image, 'sizes') &&
              attr(image, 'alt'),
          );
          assert.ok(
            Number(attr(image, 'width')) > 0 &&
              Number(attr(image, 'height')) > 0,
          );
          assert.match(attr(image, 'style')!, /object-position:\s*35% 65%/);
          const title = children.find(
            (node) => attr(node, 'id') === attr(card, 'aria-labelledby'),
          );
          assert.ok(
            title && text(title),
            'The full card link has a project-title label',
          );
        }
        for (const nodes of [home, catalog]) {
          assert.equal(marked(nodes, 'data-project-drafts').length, 0);
          assert.equal(nodes.filter((node) => node.tagName === 'h1').length, 1);
          assert.equal(
            nodes.filter((node) => node.tagName === 'main').length,
            1,
          );
          assert.ok(
            !nodes.some((node) => attr(node, 'data-project-draft') === 'true'),
          );
        }
        assert.ok(!catalogHtml.includes('Draft catalog sentinel'));
        const indexes = marked(catalog, 'data-project-records');
        const forms = marked(catalog, 'data-project-filters');
        if (count === 0) {
          assert.equal(indexes.length, 0);
          assert.equal(forms.length, 0);
          assert.equal(marked(catalog, 'data-catalog-empty').length, 1);
          return;
        }
        assert.equal(indexes.length, 1);
        assert.equal(attr(indexes[0]!, 'type'), 'application/json');
        const serialized = text(indexes[0]!);
        assert.ok(
          !serialized.includes('<'),
          'Embedded JSON must escape HTML script delimiters',
        );
        const records: ProjectSearchRecord[] = JSON.parse(serialized);
        assert.deepEqual(
          records.map(({ slug }) => slug),
          expectedOrder,
        );
        for (const tag of ['public', 'private']) {
          const expected = expectedOrder.filter((slug) =>
            entries.find(({ id }) => id === slug)!.data.tags.includes(tag),
          );
          assert.deepEqual(
            filterProjects(records, { q: '', tag, language: '', year: '' }).map(
              ({ slug }) => slug,
            ),
            expected,
          );
        }
        assert.ok(
          records.every(
            (record) => !('body' in record) && !('images' in record),
          ),
        );
        assert.equal(
          text(marked(catalog, 'data-project-count')[0]!),
          `${count} ${count === 1 ? 'project' : 'projects'}`,
        );
        assert.equal(forms.length, 1);
        assert.equal(attr(forms[0]!, 'hidden'), '');
        assert.equal(attr(forms[0]!, 'role'), 'search');
        const controls = elements(forms[0]!).filter((node) =>
          ['input', 'select'].includes(node.tagName),
        );
        assert.deepEqual(
          controls.map((node) => attr(node, 'name')),
          ['q', 'tag', 'language', 'year'],
        );
        for (const control of controls)
          assert.ok(
            catalog.some(
              (node) =>
                node.tagName === 'label' &&
                attr(node, 'for') === attr(control, 'id') &&
                text(node).trim(),
            ),
          );
        assert.ok(
          marked(catalog, 'data-project-result').every(
            (node) => attr(node, 'hidden') === undefined,
          ),
          'The initial no-script listing includes every public card',
        );
        const choices = (name: string) =>
          elements(controls.find((node) => attr(node, 'name') === name)!)
            .filter((node) => node.tagName === 'option')
            .map((node) => [attr(node, 'value'), text(node)]);
        if (count === 6) {
          assert.deepEqual(choices('tag'), [
            ['', 'All tags'],
            ['tools', 'Developer tools'],
            ['graphics', 'Graphics'],
            ['private', 'Private'],
            ['public', 'Public'],
          ]);
          assert.deepEqual(choices('language'), [
            ['', 'All languages'],
            ['cpp', 'C++'],
            ['ts', 'TypeScript'],
          ]);
          assert.deepEqual(choices('year'), [
            ['', 'All years'],
            ['2026', '2026'],
            ['2025', '2025'],
            ['2024', '2024'],
          ]);
          assert.equal(
            records.find(({ slug }) => slug === 'catalog-alpha')!.title,
            catalogLiteralTitle,
          );
          assert.ok(
            catalog.some(
              (node) =>
                node.tagName === 'h2' && text(node) === catalogLiteralTitle,
            ),
          );
          assert.ok(
            !catalog.some(
              (node) =>
                node.tagName === 'script' && text(node) === 'catalogSentinel()',
            ),
          );
          assert.match(
            text(
              cards.find(
                (node) => attr(node, 'data-project-slug') === 'catalog-alpha',
              )!,
            ),
            /Development: 2 weeks, 1 day/,
          );
          // The output checker must reject an actual catalog-card regression.
          writeFileSync(
            catalogPath,
            catalogHtml.replace(
              'data-project-draft="false"',
              'data-project-draft="true"',
            ),
          );
          await assert.rejects(checkSite({ directory }), /draft card leaked/);
          writeFileSync(catalogPath, catalogHtml);
        }
      });
  },
);
