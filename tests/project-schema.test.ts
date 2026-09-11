import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
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
import { createAstroRenderer } from 'astro-expressive-code';
import { parse } from 'parse5';
import {
  createProjectSchema,
  localImagePath,
  validateProjectBody,
  validateProjectFiles,
} from '../src/lib/project-schema.ts';
import { markdownCodeOptions } from '../scripts/markdown-code.mjs';
import {
  fixtureSvg,
  fixtureTaxonomy,
  publishedFixture,
} from './fixtures/projects/fixtures.ts';
import { checkSite } from '../scripts/check-site.mjs';
import { isolateFixtureCaches } from './fixtures/projects/build-cache.ts';

const schema = createProjectSchema(localImagePath, fixtureTaxonomy);
const valid = () => ({
  ...publishedFixture().data,
  description: 'A synthetic renderer for contract tests.',
});

test('publication is explicit; incomplete drafts have safe defaults', () => {
  const draft = schema.parse({});
  assert.equal(draft.draft, true);
  assert.deepEqual(draft.images, []);
  assert.deepEqual(draft.coverPosition, { x: 50, y: 50 });
  assert.equal(schema.parse(valid()).draft, false);
  const failed = schema.safeParse({ draft: false });
  assert.equal(failed.success, false);
  if (!failed.success)
    assert.deepEqual(
      new Set(failed.error.issues.map(({ path }) => path[0])),
      new Set([
        'title',
        'description',
        'publishedOn',
        'startedOn',
        'completedOn',
        'coverId',
        'languages',
        'tags',
        'images',
      ]),
    );
});

test('source availability is explicit at publication and cannot contradict its source link', () => {
  const privateProject = {
    ...publishedFixture('private-project', 'private').data,
    description: valid().description,
  };
  assert.equal(schema.parse(privateProject).repositoryUrl, undefined);
  assert.equal(schema.parse({ tags: ['public'] }).draft, true);
  assert.equal(schema.parse({ tags: ['private'] }).draft, true);
  const rejectsAt = (data: object, field: string, message: RegExp) => {
    const result = schema.safeParse(data);
    assert.equal(result.success, false);
    if (!result.success)
      assert.ok(
        result.error.issues.some(
          (issue) => issue.path[0] === field && message.test(issue.message),
        ),
        result.error.message,
      );
  };
  rejectsAt({ ...valid(), tags: ['graphics'] }, 'tags', /source availability/);
  rejectsAt(
    { ...valid(), repositoryUrl: undefined },
    'repositoryUrl',
    /public source/,
  );
  for (const draft of [true, false]) {
    rejectsAt(
      { ...valid(), draft, tags: ['public', 'private'] },
      'tags',
      /mutually exclusive/,
    );
    rejectsAt(
      {
        ...privateProject,
        draft,
        repositoryUrl: 'https://example.invalid/source',
      },
      'repositoryUrl',
      /must omit/,
    );
  }
  // Private source relaxes only the repository requirement.
  for (const field of [
    'title',
    'description',
    'publishedOn',
    'startedOn',
    'completedOn',
    'coverId',
  ] as const)
    rejectsAt(
      { ...privateProject, [field]: undefined },
      field,
      /Required for publication/,
    );
  for (const field of ['languages', 'images'] as const)
    rejectsAt({ ...privateProject, [field]: [] }, field, /At least one/);
  rejectsAt(
    { ...privateProject, publishedOn: '2026-02-29' },
    'publishedOn',
    /real calendar date/,
  );
  rejectsAt(
    { ...privateProject, tags: ['private', 'unknown'] },
    'tags',
    /Unknown taxonomy/,
  );
  rejectsAt(
    {
      ...privateProject,
      images: [
        {
          ...privateProject.images[0],
          src: 'https://example.invalid/image.png',
        },
      ],
    },
    'images',
    /relative local image/,
  );
  assert.throws(
    () => validateProjectBody(false, '', 'private-project.md'),
    /nonempty Markdown article/,
  );
  assert.equal(
    schema.parse({
      ...privateProject,
      releaseUrl: 'https://example.invalid/release',
      videoUrl: 'https://example.invalid/video',
    }).draft,
    false,
  );
});

test('published fields, real dates, reviewed taxonomy and unique IDs are enforced', () => {
  for (const patch of [
    { title: ' ' },
    { description: '<b>HTML</b>' },
    { publishedOn: '2026-02-29' },
    { startedOn: '2026-03-08' },
    { updatedOn: '2026-04-31' },
    { tags: ['unknown'] },
    { tags: ['graphics', 'graphics'] },
    { languages: ['cpp', 'cpp'] },
    { languages: [] },
    { repositoryUrl: 'http://example.invalid/source' },
    { repositoryUrl: 'not-a-url' },
    { repositoryUrl: '/relative/path' },
    { releaseUrl: 'javascript:alert(1)' },
    { images: [] },
    { images: [...valid().images, ...valid().images] },
    { coverId: 'absent' },
    { coverPosition: { x: -1, y: 50 } },
    { slug: 'override' },
  ])
    assert.equal(
      schema.safeParse({ ...valid(), ...patch }).success,
      false,
      JSON.stringify(patch),
    );
  assert.equal(
    createProjectSchema(localImagePath, { tags: [], languages: [] }).safeParse(
      valid(),
    ).success,
    false,
  );
});

test('gallery paths reject URL sources, empty/generic alt text and invalid references', () => {
  for (const src of [
    'https://example.invalid/image.png',
    '//example.invalid/image.png',
    'data:image/png;base64,abc',
    '/image.png',
    '../image.png?width=2',
  ]) {
    assert.equal(
      schema.safeParse({ ...valid(), images: [{ ...valid().images[0], src }] })
        .success,
      false,
    );
  }
  for (const alt of ['', ' ', 'image', 'Screenshot 1', 'placeholder'])
    assert.equal(
      schema.safeParse({ ...valid(), images: [{ ...valid().images[0], alt }] })
        .success,
      false,
    );
  assert.throws(
    () => validateProjectBody(false, ' \n<!-- TODO -->\n', 'fixture.md'),
    /fixture.md: body:/,
  );
  assert.doesNotThrow(() => validateProjectBody(true, '', 'draft.md'));
});

test('raw canonical basenames and duplicates are checked before normalization', () => {
  for (const filename of [
    'Bad_Name.md',
    'bad name.md',
    'café.md',
    '-bad.md',
    'bad--name.md',
    'bad.MD',
  ])
    assert.throws(() => validateProjectFiles([filename]), /filename/);
  assert.throws(
    () => validateProjectFiles(['same.md', 'nested/same.md']),
    /duplicate slug/,
  );
  assert.throws(() => validateProjectFiles(['nested/other.md']), /directly/);
  assert.equal(
    validateProjectFiles(['good-slug.md']).get('good-slug'),
    'good-slug.md',
  );
});

type CodeNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: CodeNode[];
};
function codeNodes(node: CodeNode): CodeNode[] {
  return [node, ...(node.children ?? []).flatMap(codeNodes)];
}

test('renderer preserves code, supplies titles/plain fallback and supports opt-in line numbers', async () => {
  const root = new URL('../', import.meta.url);
  const { ec } = await createAstroRenderer({
    ecConfig: markdownCodeOptions,
    astroConfig: { root, srcDir: new URL('src/', root), base: '/' },
  });
  for (const [language, label] of [
    ['ts', 'TypeScript'],
    ['cpp', 'C++'],
    ['bash', 'Shell'],
    ['', 'Plain text'],
    ['not-a-real-language', 'Plain text'],
  ]) {
    const code =
      '// example.ts\n\tif (a < b && b > 0) {\n  print("<script>&");\n}';
    const result = await ec.render({ code, language });
    assert.equal(result.renderedGroupContents[0].codeBlock.code, code);
    const serialized = JSON.stringify(result.renderedGroupAst);
    assert.ok(serialized.includes(label), `Missing title ${label}`);
    const nodes = codeNodes(result.renderedGroupAst);
    const copy = nodes.find((node) => node.tagName === 'button');
    assert.equal(
      copy?.properties?.dataCode,
      code.replaceAll('\n', '\u007f'),
      'Copy button must carry original source',
    );
    assert.ok(
      !serialized.includes('"tagName":"script"'),
      'Code must not become HTML elements',
    );
    assert.ok(
      !serialized.includes('"className":["gutter"'),
      'Line numbers default off',
    );
  }
  const titled = await ec.render({
    code: '<tag> & value',
    language: 'text',
    meta: 'title="example.txt" showLineNumbers',
  });
  assert.equal(
    titled.renderedGroupContents[0].codeBlock.props.title,
    'example.txt',
  );
  assert.equal(
    titled.renderedGroupContents[0].codeBlock.props.showLineNumbers,
    true,
  );
});

const project = fileURLToPath(new URL('..', import.meta.url));
function put(root: string, file: string, content: string) {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), content);
}

test('Astro wrappers select page modes before import without opening servers', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'hephaestion-wrappers-'));
  t.after(() => rmSync(root, { recursive: true }));
  for (const file of ['scripts/astro.mjs', 'scripts/serve.mjs']) {
    put(root, file, readFileSync(join(project, file), 'utf8'));
  }
  const report = `console.log(JSON.stringify({ mode: process.env.NODE_ENV, telemetry: process.env.ASTRO_TELEMETRY_DISABLED }));`;
  put(
    root,
    'node_modules/astro/package.json',
    JSON.stringify({ type: 'module', exports: './index.mjs' }),
  );
  put(root, 'node_modules/astro/bin/astro.mjs', report);
  put(
    root,
    'node_modules/astro/index.mjs',
    `${report}\nexport const dev = async () => ({ stop() {} });\nexport const preview = dev;`,
  );
  for (const inherited of ['production', 'development', undefined]) {
    for (const [wrapper, command, expected] of [
      ['serve', 'dev', 'development'],
      ['serve', 'preview', 'production'],
      ['astro', 'build', 'production'],
      ['astro', 'preview', 'production'],
      ['astro', 'dev', 'development'],
      ['astro', 'check', inherited],
      ['astro', 'sync', inherited],
    ]) {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: '0',
      };
      if (inherited === undefined) delete env.NODE_ENV;
      else env.NODE_ENV = inherited;
      const result = spawnSync(
        process.execPath,
        [join(root, `scripts/${wrapper}.mjs`), command!],
        { cwd: root, env, encoding: 'utf8' },
      );
      assert.equal(result.error, undefined);
      assert.equal(result.status, 0, result.stderr);
      const observed = JSON.parse(result.stdout);
      assert.equal(
        observed.mode,
        expected,
        `${wrapper} ${command}, inherited ${inherited}`,
      );
      assert.equal(observed.telemetry, '1');
    }
  }
});

test('built-output checker reads HTML elements, ignores code/script examples, and checks srcset assets', async (t) => {
  const root = mkdtempSync(join(tmpdir(), 'hephaestion-output-'));
  t.after(() => rmSync(root, { recursive: true }));
  put(root, 'image.svg', fixtureSvg);
  const example =
    '<pre>&lt;a href="/not-a-route"&gt;</pre><script>const example = \'href="/also-not-a-route"\';</script>';
  put(
    root,
    'index.html',
    `<html><body>${example}<img src="/image.svg" srcset="/image.svg 160w, /image.svg 320w"></body></html>`,
  );
  await checkSite({ directory: root, visitCounter: false });
  put(root, 'index.html', '<a href="/missing/">Broken route</a>');
  await assert.rejects(
    checkSite({ directory: root, visitCounter: false }),
    /broken local link: \/missing\//,
  );
  mkdirSync(join(root, 'directory-without-index'));
  put(
    root,
    'index.html',
    '<a href="/directory-without-index">Broken directory route</a>',
  );
  await assert.rejects(
    checkSite({ directory: root, visitCounter: false }),
    /broken local link/,
  );
  put(root, 'directory-without-index/index.html', '<h1>Now a valid route</h1>');
  await checkSite({ directory: root, visitCounter: false });
  put(
    root,
    'index.html',
    '<img src="/image.svg" srcset="/image.svg 160w, /missing.svg 320w">',
  );
  await assert.rejects(
    checkSite({ directory: root, visitCounter: false }),
    /broken local link: \/missing.svg/,
  );
});

test(
  'actual Astro builds validate content before routes and keep synthetic assets isolated',
  { timeout: 120_000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), 'hephaestion-content-'));
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
      'src/content.config.ts',
      'src/types/projects.ts',
      'src/lib',
      'scripts/markdown-code.mjs',
      'scripts/image-service.mjs',
    ]) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      cpSync(join(project, file), join(root, file), { recursive: true });
    }
    isolateFixtureCaches(root);
    put(
      root,
      'src/data/project-taxonomy.ts',
      `export const projectTaxonomy = ${JSON.stringify(fixtureTaxonomy)};`,
    );
    put(
      root,
      'src/pages/index.astro',
      '<html><body><h1>Fixture build</h1></body></html>',
    );
    const fixture = publishedFixture();
    const entryPath = 'src/content/projects/fixture-project.md';
    const imagePath = 'src/assets/projects/fixture-project/overview.svg';
    put(root, imagePath, fixtureSvg);
    const entry = (data: object, body = fixture.body!) =>
      put(root, entryPath, `---\n${JSON.stringify(data)}\n---\n${body}`);
    const build = (environment: Record<string, string> = {}) => {
      const result = spawnSync(
        process.execPath,
        [join(project, 'scripts/astro.mjs'), 'build'],
        {
          cwd: root,
          encoding: 'utf8',
          env: {
            ...process.env,
            ...environment,
            ASTRO_TELEMETRY_DISABLED: '1',
          },
          timeout: 25_000,
        },
      );
      assert.equal(result.error, undefined);
      return { status: result.status, output: result.stdout + result.stderr };
    };
    const rejects = (pattern: RegExp) => {
      const result = build();
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, pattern);
    };

    await t.test(
      'valid publication builds with no collection-consuming routes',
      () => {
        entry(valid());
        const result = build();
        assert.equal(result.status, 0, result.output);
      },
    );
    await t.test('image-less publication fails a cached rebuild', () => {
      entry({ ...valid(), images: [] });
      rejects(/images|coverId/);
    });
    await t.test('empty publication body fails before routes', () => {
      entry(valid(), '  \n<!-- unfinished -->');
      rejects(/body:.*nonempty/);
    });
    await t.test('missing and corrupt local images fail before routes', () => {
      entry({
        ...valid(),
        images: [
          {
            ...valid().images[0],
            src: '../../assets/projects/fixture-project/missing.svg',
          },
        ],
      });
      rejects(/images\.0\.src:.*does not exist/);
      entry(valid());
      put(root, imagePath, 'not an image');
      rejects(/image|SVG/i);
      put(root, imagePath, fixtureSvg);
    });
    await t.test(
      'production drafts still validate schema and gallery assets before exclusion',
      () => {
        entry({ ...valid(), draft: true, tags: ['public', 'private'] });
        rejects(/mutually exclusive/);
        entry({ ...valid(), draft: true });
        rmSync(join(root, imagePath));
        rejects(/images\.0\.src:.*does not exist/);
        put(root, imagePath, 'not an image');
        rejects(/images\.0\.src:.*not a valid local image/);
        put(root, imagePath, fixtureSvg);
      },
    );
    await t.test('malformed and duplicate raw slugs fail', () => {
      entry(valid());
      put(root, 'src/content/projects/Bad_Name.md', '---\n{}\n---');
      rejects(/Bad_Name.md: filename/);
      rmSync(join(root, 'src/content/projects/Bad_Name.md'));
      put(
        root,
        'src/content/projects/nested/fixture-project.md',
        '---\n{}\n---',
      );
      rejects(/duplicate slug/);
      rmSync(join(root, 'src/content/projects/nested'), { recursive: true });
    });
    await t.test('taxonomy changes invalidate unchanged content', () => {
      entry(valid());
      const result = build();
      assert.equal(result.status, 0, result.output);
      put(
        root,
        'src/data/project-taxonomy.ts',
        'export const projectTaxonomy = { tags: [], languages: [] };',
      );
      rejects(/Unknown taxonomy identifier/);
      put(
        root,
        'src/data/project-taxonomy.ts',
        `export const projectTaxonomy = ${JSON.stringify(fixtureTaxonomy)};`,
      );
    });
    await t.test(
      'production build overrides inherited development; public queries, metadata and rendering exclude incomplete drafts',
      () => {
        const title = 'Café </script><script>literal title</script>';
        const source = '\tconst literal = "<tag> & value";';
        entry(
          { ...valid(), title },
          `${fixture.body}\n\n\`\`\`ts title="sample.ts" showLineNumbers\n${source}\n\`\`\`\n\n\`\`\`unknown-language\n<untrusted> & text\n\`\`\``,
        );
        put(
          root,
          'src/content/projects/draft-fixture.md',
          '---\ntitle: Draft-only sentinel\n---\n',
        );
        put(
          root,
          'src/pages/index.astro',
          `---
import { Image } from 'astro:assets';
import { render } from 'astro:content';
import { getPublicProjects, getProjectsForDevelopment } from '../lib/projects.ts';
import { createProjectSearchRecords } from '../lib/project-search.ts';
const projects = await getPublicProjects();
let refused = false;
try { await getProjectsForDevelopment(); } catch { refused = true; }
if (!refused) throw new Error('Production allowed draft queries');
const records = createProjectSearchRecords(projects);
const { Content } = await render(projects[0]);
---
<html><body><h1>{projects[0].data.title}</h1><Image src={projects[0].data.images[0].src} alt={projects[0].data.images[0].alt} /><Content /><script type="application/json" set:html={JSON.stringify(records).replaceAll('<', '\\\\u003c')} /></body></html>`,
        );
        const result = build({ NODE_ENV: 'development' });
        assert.equal(result.status, 0, result.output);
        const html = readFileSync(join(root, 'dist/index.html'), 'utf8');
        assert.match(html, /width="160"/);
        assert.match(html, /height="90"/);
        assert.match(html, /_astro\/overview/);
        assert.ok(!html.includes('Draft-only sentinel'));
        assert.ok(!html.includes('draft-fixture'));
        assert.match(html, /synthetic fixture content/);
        assert.ok(!html.includes('<script>literal title</script>'));
        assert.match(html, /sample.ts/);
        assert.match(html, /Plain text/);
        const document = parse(html);
        const walk = (node: {
          childNodes?: unknown[];
          attrs?: { name: string; value: string }[];
        }): { name: string; value: string }[] => [
          ...(node.attrs ?? []),
          ...(node.childNodes ?? []).flatMap((child) =>
            walk(child as Parameters<typeof walk>[0]),
          ),
        ];
        assert.ok(
          walk(document).some(
            ({ name, value }) => name === 'data-code' && value === source,
          ),
          'Markdown integration preserves tabs and literal source for Copy',
        );
      },
    );
  },
);
