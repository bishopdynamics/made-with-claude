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
  literalCaption,
  literalTitle,
  writePageFixtures,
} from './fixtures/projects/page-fixtures.ts';

type Element = DefaultTreeAdapterMap['element'];
type Node = DefaultTreeAdapterMap['node'];
function elements(node: Node): Element[] {
  return [
    ...('tagName' in node ? [node] : []),
    ...('childNodes' in node ? node.childNodes.flatMap(elements) : []),
  ];
}
const attr = (element: Element, name: string) =>
  element.attrs.find((attribute) => attribute.name === name)?.value;
function text(node: Node): string {
  return 'value' in node
    ? node.value
    : 'childNodes' in node
      ? node.childNodes.map(text).join('')
      : '';
}
const project = fileURLToPath(new URL('../', import.meta.url));

test(
  'actual project routes publish semantic pages, isolated image derivatives, and safe gallery fallbacks while excluding drafts',
  { timeout: 90_000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), 'hephaestion-pages-'));
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
    ]) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      cpSync(join(project, file), join(root, file), { recursive: true });
    }
    isolateFixtureCaches(root);
    const content = join(root, 'src/content/projects');
    if (existsSync(content)) rmSync(content, { recursive: true });
    writePageFixtures(root);
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
        timeout: 60_000,
      },
    );
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    t.diagnostic(
      result.stdout
        .split('\n')
        .filter((line) => /gallery-|page\(s\) built|image assets/.test(line))
        .join('\n'),
    );
    const directory = join(root, 'dist');
    const options = {
      directory,
      requiredRoutes: ['/', '/projects/', '/404.html'],
      publicProjectSlugs: ['gallery-multiple', 'gallery-single'],
      draftProjectSlugs: ['draft-empty', 'draft-sentinel'],
      requireProjectMedia: true,
    };
    await checkSite(options);

    for (const [slug, count] of [
      ['gallery-multiple', 2],
      ['gallery-single', 1],
    ] as const) {
      const html = readFileSync(
        join(directory, `projects/${slug}/index.html`),
        'utf8',
      );
      const nodes = elements(parse(html));
      const marked = (name: string) =>
        nodes.filter((node) => attr(node, name) !== undefined);
      const heading = nodes.find((node) => node.tagName === 'h1')!;
      assert.equal(
        text(heading),
        slug === 'gallery-multiple' ? literalTitle : 'Single-image fixture',
      );
      assert.ok(
        nodes
          .filter((node) => node.tagName === 'script')
          .every(
            (node) =>
              !['caption', 'literal project title'].includes(text(node)),
          ),
        'Literal media text must never become script elements',
      );
      assert.ok(!html.includes('Private draft sentinel'));
      assert.equal(
        attr(
          nodes.find((node) => attr(node, 'rel') === 'canonical')!,
          'href',
        ),
        `https://whatclaudemade.com/projects/${slug}/`,
      );
      const article = nodes.find((node) => node.tagName === 'article')!;
      assert.match(attr(article, 'class')!, /\bprose\b/);
      assert.match(text(article), /The fixture story/);
      assert.match(text(article), /synthetic fixture content/);
      assert.match(text(article), /const literal = "<tag> & value";/);
      const metadata = nodes.find((node) => node.tagName === 'dl')!;
      assert.match(text(metadata), /C\+\+/);
      assert.match(text(metadata), /Graphics/);
      assert.match(text(metadata), /2 weeks, 1 day/);
      assert.deepEqual(
        elements(metadata)
          .filter((node) => node.tagName === 'time')
          .map((node) => attr(node, 'datetime')),
        ['2026-02-20', '2026-03-07', '2026-09-07', '2026-09-08'],
      );
      for (const href of [
        'https://example.invalid/source',
        'https://example.invalid/release?q=one&next=two',
        'https://example.invalid/video',
        '/projects/',
      ])
        assert.ok(
          nodes.some(
            (node) => node.tagName === 'a' && attr(node, 'href') === href,
          ),
        );
      const links = marked('data-gallery-image');
      assert.equal(links.length, count);
      assert.equal(attr(links[0]!, 'data-caption'), literalCaption);
      assert.ok(nodes.indexOf(heading) < nodes.indexOf(metadata));
      assert.ok(nodes.indexOf(metadata) < nodes.indexOf(links[0]!));
      assert.ok(nodes.indexOf(links[0]!) < nodes.indexOf(article));
      const dialog = marked('data-gallery-dialog')[0]!;
      assert.equal(
        elements(dialog).filter((node) => node.tagName === 'img').length,
        0,
      );
      for (const [index, link] of links.entries()) {
        const image = elements(link).find((node) => node.tagName === 'img')!;
        assert.ok(attr(image, 'srcset'));
        assert.ok(attr(image, 'sizes'));
        assert.notEqual(
          attr(link, 'href'),
          attr(image, 'src'),
          'Full originals must be separate from optimized thumbnails',
        );
        assert.equal(attr(image, 'loading'), index === 0 ? 'eager' : 'lazy');
        const asset = readFileSync(join(directory, attr(link, 'href')!));
        assert.equal(
          asset.readUInt32BE(16),
          Number(attr(link, 'data-image-width')),
        );
        assert.equal(
          asset.readUInt32BE(20),
          Number(attr(link, 'data-image-height')),
        );
      }
    }
    // Exercise the production checker against a real generated-page regression.
    const pagePath = join(directory, 'projects/gallery-single/index.html');
    const original = readFileSync(pagePath, 'utf8');
    writeFileSync(
      pagePath,
      original.replace(
        'data-project-draft="false"',
        'data-project-draft="true"',
      ),
    );
    await assert.rejects(checkSite(options), /draft page leaked/);
    writeFileSync(pagePath, original);
  },
);
