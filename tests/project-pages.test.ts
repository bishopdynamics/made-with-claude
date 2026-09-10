import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
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
  draftMedia,
  draftVideoId,
  literalCaption,
  literalTitle,
  publicVideoId,
  publicVideoUrl,
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
      'scripts/image-service.mjs',
    ]) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      cpSync(join(project, file), join(root, file), { recursive: true });
    }
    isolateFixtureCaches(root);
    const content = join(root, 'src/content/projects');
    if (existsSync(content)) rmSync(content, { recursive: true });
    writePageFixtures(root);
    const build = () =>
      spawnSync(
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
    // Populate the same cache/output with a previously published article, then
    // withdraw it. A warm production rebuild must remove its stored imports too.
    const draftPath = join(content, 'draft-sentinel.md');
    const draft = readFileSync(draftPath, 'utf8');
    writeFileSync(
      draftPath,
      draft.replace(
        '---\n',
        `---\ndraft: false\ndescription: Synthetic article for cached asset withdrawal verification\npublishedOn: '2026-09-07'\nstartedOn: '2026-09-01'\ncompletedOn: '2026-09-02'\nlanguages: [ts]\ncoverId: overview\n`,
      ),
    );
    const warm = build();
    assert.equal(warm.error, undefined);
    assert.equal(warm.status, 0, warm.stdout + warm.stderr);
    assert.ok(
      readFileSync(
        join(root, 'dist/projects/draft-sentinel/index.html'),
        'utf8',
      ).includes(`data-video-id="${draftVideoId}"`),
      'Draft video must be present before withdrawal',
    );
    const warmAssets = readdirSync(join(root, 'dist/_astro')).map((name) =>
      readFileSync(join(root, 'dist/_astro', name)),
    );
    for (const [name, svg] of Object.entries(draftMedia))
      assert.ok(
        warmAssets.some((bytes) => bytes.equals(Buffer.from(svg))),
        `${name} must exist before withdrawal`,
      );
    writeFileSync(draftPath, draft);
    const result = build();
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
      publicProjectSlugs: [
        'gallery-multiple',
        'gallery-single',
        'gallery-no-video',
      ],
      draftProjectSlugs: ['draft-empty', 'draft-sentinel'],
      requireProjectMedia: true,
      requireIndexability: true,
    };
    await checkSite(options);
    const sitemapPath = join(directory, 'sitemap.xml');
    const sitemap = readFileSync(sitemapPath, 'utf8');
    const sitemapNodes = elements(parse(sitemap));
    assert.deepEqual(
      sitemapNodes
        .filter((node) => node.tagName === 'loc')
        .map(text)
        .sort(),
      [
        'https://whatclaudemade.com/',
        'https://whatclaudemade.com/projects/',
        'https://whatclaudemade.com/projects/gallery-multiple/',
        'https://whatclaudemade.com/projects/gallery-no-video/',
        'https://whatclaudemade.com/projects/gallery-single/',
      ],
      'Both source availability kinds are indexable; both draft kinds are excluded',
    );
    assert.deepEqual(
      sitemapNodes.filter((node) => node.tagName === 'lastmod').map(text),
      ['2026-09-08', '2026-09-08', '2026-09-08'],
      'Updated dates describe article modifications',
    );
    for (const entry of readdirSync(directory, {
      recursive: true,
      withFileTypes: true,
    })) {
      if (!entry.isFile()) continue;
      const bytes = readFileSync(join(entry.parentPath, entry.name));
      for (const [name, svg] of Object.entries(draftMedia)) {
        assert.ok(
          !entry.name.includes(name.replace('.svg', '')),
          `Draft media filename leaked: ${entry.name}`,
        );
        assert.ok(
          !bytes.includes(Buffer.from(svg)),
          `Draft media bytes leaked: ${entry.name}`,
        );
      }
      assert.ok(
        !bytes.includes(Buffer.from('Private draft sentinel')),
        `Draft content leaked: ${entry.name}`,
      );
      assert.ok(
        !bytes.includes(Buffer.from(draftVideoId)),
        `Draft video ID leaked: ${entry.name}`,
      );
    }

    await t.test(
      'built-output validation rejects missing or incorrect launch assets',
      async () => {
        for (const invalid of [
          sitemap.replace(
            '</urlset>',
            '<url><loc>https://whatclaudemade.com/projects/draft-sentinel/</loc></url></urlset>',
          ),
          sitemap.replace(
            '</urlset>',
            '<url><loc>https://whatclaudemade.com/404.html</loc></url></urlset>',
          ),
          sitemap.replace(
            'https://whatclaudemade.com/projects/gallery-single/',
            'https://whatclaudemade.com/projects/?tag=private',
          ),
          sitemap.replace(
            'https://whatclaudemade.com/projects/gallery-single/',
            'https://example.invalid/projects/gallery-single/',
          ),
          sitemap.replace(
            '<lastmod>2026-09-08</lastmod>',
            '<lastmod>2026-09-07</lastmod>',
          ),
          sitemap.replace('</urlset>', ''),
          sitemap.replace('</loc>', '&broken;</loc>'),
        ]) {
          writeFileSync(sitemapPath, invalid);
          await assert.rejects(checkSite(options), /sitemap/i);
        }
        rmSync(sitemapPath);
        await assert.rejects(checkSite(options), /sitemap\.xml/);
        writeFileSync(sitemapPath, sitemap);
        const robotsPath = join(directory, 'robots.txt');
        const robots = readFileSync(robotsPath, 'utf8');
        writeFileSync(robotsPath, robots.replace('Allow: /', 'Disallow: /'));
        await assert.rejects(checkSite(options), /Robots/);
        rmSync(robotsPath);
        await assert.rejects(checkSite(options), /robots\.txt/);
        writeFileSync(robotsPath, robots);
      },
    );

    for (const [slug, count] of [
      ['gallery-multiple', 2],
      ['gallery-single', 1],
      ['gallery-no-video', 1],
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
        slug === 'gallery-multiple'
          ? literalTitle
          : slug === 'gallery-single'
            ? 'Single-image fixture'
            : 'No-video fixture',
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
      assert.match(
        text(metadata),
        slug === 'gallery-single' ? /Private/ : /Public/,
      );
      assert.match(text(metadata), /Updated/);
      assert.match(text(metadata), /2 weeks, 1 day/);
      assert.deepEqual(
        elements(metadata)
          .filter((node) => node.tagName === 'time')
          .map((node) => attr(node, 'datetime')),
        ['2026-02-20', '2026-03-07', '2026-09-07', '2026-09-08'],
      );
      for (const href of [
        'https://example.invalid/release?q=one&next=two',
        '/projects/',
      ])
        assert.ok(
          nodes.some(
            (node) => node.tagName === 'a' && attr(node, 'href') === href,
          ),
        );
      const sourceLinks = nodes.filter(
        (node) => node.tagName === 'a' && /^Source\b/.test(text(node).trim()),
      );
      if (slug === 'gallery-single') {
        assert.equal(
          sourceLinks.length,
          0,
          'Private source has no Source link',
        );
        assert.ok(!html.includes('https://example.invalid/source'));
      } else {
        assert.equal(sourceLinks.length, 1);
        assert.equal(
          attr(sourceLinks[0]!, 'href'),
          'https://example.invalid/source',
        );
      }
      const links = marked('data-gallery-image');
      assert.equal(links.length, count);
      assert.equal(attr(links[0]!, 'data-caption'), literalCaption);
      assert.ok(nodes.indexOf(heading) < nodes.indexOf(metadata));
      assert.ok(nodes.indexOf(metadata) < nodes.indexOf(links[0]!));
      assert.ok(nodes.indexOf(links[0]!) < nodes.indexOf(article));
      const videoLinks = nodes.filter(
        (node) => node.tagName === 'a' && /^Video\b/.test(text(node).trim()),
      );
      const videos = marked('data-project-video');
      const frames = nodes.filter((node) => node.tagName === 'iframe');
      if (slug === 'gallery-multiple') {
        assert.equal(videoLinks.length, 1);
        assert.equal(attr(videoLinks[0]!, 'href'), publicVideoUrl);
        assert.equal(videos.length, 1);
        const video = videos[0]!;
        assert.equal(video.tagName, 'section');
        assert.equal(attr(video, 'class'), 'project-video');
        assert.equal(attr(video, 'data-project-video'), 'youtube');
        assert.equal(attr(video, 'data-video-id'), publicVideoId);
        assert.ok(nodes.indexOf(links.at(-1)!) < nodes.indexOf(video));
        assert.ok(nodes.indexOf(video) < nodes.indexOf(article));
        const videoNodes = elements(video);
        const videoHeading = videoNodes.find((node) => node.tagName === 'h2')!;
        assert.equal(text(videoHeading), 'Video');
        assert.equal(attr(videoHeading, 'id'), `video-heading-${slug}`);
        assert.equal(attr(video, 'aria-labelledby'), attr(videoHeading, 'id'));
        assert.equal(frames.length, 1);
        const frame = frames[0]!;
        assert.ok(videoNodes.includes(frame));
        const src = attr(frame, 'src')!;
        assert.notEqual(src, publicVideoUrl);
        const url = new URL(src);
        assert.equal(url.origin, 'https://www.youtube-nocookie.com');
        assert.equal(url.pathname, `/embed/${publicVideoId}`);
        assert.deepEqual([...url.searchParams].sort(), [
          ['autoplay', '0'],
          ['color', 'white'],
          ['controls', '1'],
          ['disablekb', '0'],
          ['fs', '1'],
          ['iv_load_policy', '3'],
          ['playsinline', '1'],
          ['rel', '0'],
        ]);
        for (const name of [
          'modestbranding',
          'showinfo',
          'autohide',
          'theme',
          'origin',
          'enablejsapi',
        ])
          assert.equal(url.searchParams.has(name), false);
        assert.equal(attr(frame, 'title'), `${literalTitle} video`);
        assert.equal(attr(frame, 'loading'), 'lazy');
        assert.equal(
          attr(frame, 'referrerpolicy'),
          'strict-origin-when-cross-origin',
        );
        assert.notEqual(attr(frame, 'allowfullscreen'), undefined);
        assert.equal(
          attr(frame, 'allow'),
          'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen',
        );
        assert.equal(attr(frame, 'width'), '560');
        assert.equal(attr(frame, 'height'), '315');
        const fallback = videoNodes.filter(
          (node) =>
            node.tagName === 'a' &&
            /^Watch on YouTube\b/.test(text(node).trim()),
        );
        assert.equal(fallback.length, 1);
        assert.equal(
          attr(fallback[0]!, 'href'),
          `https://www.youtube.com/watch?v=${publicVideoId}`,
        );
        assert.equal(attr(fallback[0]!, 'class'), 'button-link');
        assert.equal(attr(fallback[0]!, 'rel'), 'noopener');
        assert.equal(attr(fallback[0]!, 'target'), undefined);
      } else {
        assert.equal(videos.length, 0);
        assert.equal(frames.length, 0);
        if (slug === 'gallery-single') {
          assert.equal(videoLinks.length, 1);
          assert.equal(
            attr(videoLinks[0]!, 'href'),
            'https://example.invalid/video',
          );
        } else {
          assert.equal(videoLinks.length, 0);
        }
      }
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
