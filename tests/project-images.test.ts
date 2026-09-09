import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import {
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parse, type DefaultTreeAdapterMap } from 'parse5';
import sharp from 'sharp';
import { isolateFixtureCaches } from './fixtures/projects/build-cache.ts';

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
const project = fileURLToPath(new URL('../', import.meta.url));

async function unusedPort(): Promise<number> {
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const address = socket.address();
  assert.ok(address && typeof address !== 'string');
  const port = address.port;
  await new Promise<void>((resolve, reject) =>
    socket.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

test(
  'development serves copied originals and decoded thumbnails after a Vite restart',
  { timeout: 90_000 },
  async (t) => {
    const root = mkdtempSync(join(tmpdir(), 'hephaestion-image-fix-test-'));
    let stopServer = async () => {};
    t.after(async () => {
      await stopServer();
      rmSync(root, { recursive: true });
    });
    const assets = 'src/assets/projects/vintage-vault';
    const originals = new Map<string, Buffer>();
    for (const name of ['library.jpg', 'create.jpg', 'tasks.jpg']) {
      const source = join(project, assets, name);
      assert.ok(lstatSync(source).isFile(), `${name} must be a regular file`);
      assert.ok(
        realpathSync(source).startsWith(realpathSync(project) + sep),
        `${name} must belong to this repository`,
      );
      originals.set(name, readFileSync(source));
    }
    for (const file of [
      'package.json',
      'astro.config.mjs',
      'tsconfig.json',
      'src',
      'public',
      'scripts',
    ]) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      cpSync(join(project, file), join(root, file), { recursive: true });
    }
    symlinkSync(
      join(project, 'node_modules'),
      join(root, 'node_modules'),
      'dir',
    );
    isolateFixtureCaches(root);
    cpSync(
      join(root, 'astro.config.mjs'),
      join(root, 'astro.restart-base.mjs'),
    );
    writeFileSync(
      join(root, 'astro.config.mjs'),
      `import base from './astro.restart-base.mjs';
export default { ...base, vite: { ...base.vite, plugins: [{
  name: 'fixture-restart',
  configureServer(server) {
    server.middlewares.use('/__test/restart', (_request, response) => {
      response.end('restarting');
      setTimeout(() => server.restart(), 10);
    });
  },
}] } };\n`,
    );
    const port = await unusedPort();
    const base = `http://127.0.0.1:${port}`;
    const child = spawn(
      process.execPath,
      ['scripts/serve.mjs', 'dev', '--port', String(port)],
      {
        cwd: root,
        env: { ...process.env, NODE_ENV: 'production' },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let output = '';
    for (const stream of [child.stdout, child.stderr])
      stream.on('data', (data: Buffer) => {
        output = (output + data.toString()).slice(-64_000);
      });
    const exited = once(child, 'exit');
    stopServer = async () => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGTERM');
        const force = setTimeout(() => child.kill('SIGKILL'), 5_000);
        try {
          await exited;
        } finally {
          clearTimeout(force);
        }
      }
    };

    let page: Response | undefined;
    const deadline = Date.now() + 45_000;
    while (Date.now() < deadline) {
      assert.equal(child.exitCode, null, output);
      try {
        page = await fetch(`${base}/projects/vintage-vault/`, {
          signal: AbortSignal.timeout(5_000),
        });
        break;
      } catch {
        await delay(100);
      }
    }
    assert.ok(page, `Development server did not start:\n${output}`);
    assert.equal(page.status, 200, await page.clone().text());
    const links = elements(parse(await page.text())).filter(
      (node) => attr(node, 'data-gallery-image') !== undefined,
    );
    assert.equal(links.length, originals.size);
    // HTML initializes Astro's cached image service, but Sharp is lazy-loaded
    // only on the first derivative. Exercise that first load after Vite replaces
    // its module runner during a Vite restart (e.g. dependency reoptimization).
    const restartOutput = output.length;
    const restart = await fetch(`${base}/__test/restart`, { method: 'POST' });
    assert.equal(restart.status, 200);
    const restartDeadline = Date.now() + 20_000;
    while (
      !/server restarted/i.test(output.slice(restartOutput)) &&
      Date.now() < restartDeadline
    )
      await delay(100);
    assert.match(output.slice(restartOutput), /server restarted/i, output);
    let derivatives = 0;
    for (const link of links) {
      const originalUrl = new URL(attr(link, 'href')!, base);
      assert.equal(originalUrl.origin, base);
      assert.ok(
        decodeURIComponent(originalUrl.pathname).startsWith(
          '/@fs' + realpathSync(join(root, assets)) + '/',
        ),
        'Original must resolve inside the copied checkout, not its source',
      );
      const name = originalUrl.pathname.split('/').at(-1)!;
      const expected = originals.get(name);
      assert.ok(expected, `Unexpected gallery original: ${name}`);
      const original = await fetch(originalUrl, {
        signal: AbortSignal.timeout(5_000),
      });
      assert.equal(original.status, 200);
      assert.deepEqual(Buffer.from(await original.arrayBuffer()), expected);
      const image = elements(link).find((node) => node.tagName === 'img')!;
      const urls = new Set([
        attr(image, 'src')!,
        ...attr(image, 'srcset')!
          .split(',')
          .map((candidate) => candidate.trim().split(/\s+/)[0]!),
      ]);
      for (const url of urls) {
        const thumbnailUrl = new URL(url, base);
        assert.equal(thumbnailUrl.origin, base);
        assert.equal(thumbnailUrl.pathname, '/_image');
        const thumbnail = await fetch(thumbnailUrl, {
          signal: AbortSignal.timeout(5_000),
        });
        assert.equal(thumbnail.status, 200, `${url}\n${output}`);
        assert.equal(thumbnail.headers.get('content-type'), 'image/webp');
        const bytes = Buffer.from(await thumbnail.arrayBuffer());
        const metadata = await sharp(bytes).metadata();
        assert.equal(metadata.format, 'webp');
        assert.equal(
          metadata.width,
          Number(thumbnailUrl.searchParams.get('w')),
        );
        assert.ok(metadata.height && metadata.height < 1106);
        assert.notDeepEqual(bytes, expected, 'Thumbnail must be transformed');
        derivatives++;
      }
    }
    t.diagnostic(
      `Served ${originals.size} byte-identical originals and ${derivatives} decoded WebP derivatives from copied repository assets.`,
    );

    const animationPage = await fetch(
      `${base}/projects/half-life-continuum-edition/`,
      { signal: AbortSignal.timeout(5_000) },
    );
    assert.equal(animationPage.status, 200);
    const animationImage = elements(parse(await animationPage.text())).find(
      (node) =>
        node.tagName === 'img' &&
        new URL(attr(node, 'src')!, base).searchParams
          .get('href')
          ?.includes('/menu-tour.gif'),
    );
    assert.ok(animationImage, 'The inline GIF must use the image service');
    const animation = await fetch(new URL(attr(animationImage, 'src')!, base), {
      signal: AbortSignal.timeout(30_000),
    });
    assert.equal(animation.status, 200, output);
    const animatedSource = await sharp(
      join(
        root,
        'src/assets/projects/half-life-continuum-edition/menu-tour.gif',
      ),
      { animated: true },
    ).metadata();
    const animatedResult = await sharp(
      Buffer.from(await animation.arrayBuffer()),
      { animated: true },
    ).metadata();
    assert.ok(animatedResult.pages && animatedResult.pages > 1);
    assert.equal(animatedResult.loop, animatedSource.loop);
    const duration = (delays: number[] | undefined) =>
      delays?.reduce((total, milliseconds) => total + milliseconds, 0);
    // Encoders can coalesce adjacent identical frames; playback time must survive.
    assert.equal(
      duration(animatedResult.delay),
      duration(animatedSource.delay),
    );
    t.diagnostic(
      `Inline animation retains ${duration(animatedResult.delay)} ms of looping playback.`,
    );
  },
);
