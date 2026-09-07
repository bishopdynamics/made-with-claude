import assert from 'node:assert/strict';
import { stat, readdir, readFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'parse5';

const site = 'https://madewithclaude.com';
function* elements(node) {
  if (node.tagName) yield node;
  for (const child of node.childNodes ?? []) yield* elements(child);
  if (node.content) yield* elements(node.content);
}

// URL tokens end at whitespace; a comma inside a data URL is part of its URL.
function srcsetUrls(value) {
  const urls = [];
  let remaining = value;
  while (remaining.trim()) {
    remaining = remaining.replace(/^[\s,]+/, '');
    const token = remaining.match(/^\S+/)?.[0];
    if (!token) break;
    urls.push(token.replace(/,+$/, ''));
    remaining = remaining.slice(token.length);
    if (!token.endsWith(','))
      remaining = remaining.replace(/^[^,]*(?:,|$)/, '');
  }
  return urls;
}

/** Later slices extend requiredRoutes and pass project slugs/media expectations. */
export async function checkSite({
  directory = fileURLToPath(new URL('../dist/', import.meta.url)),
  requiredRoutes = ['/'],
  publicProjectSlugs,
  draftProjectSlugs = [],
  requireProjectMedia = false,
} = {}) {
  const root = resolve(directory);
  const files = await readdir(root, { recursive: true });
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  const hasFile = async (path) => {
    try {
      return (await stat(path)).isFile();
    } catch {
      return false;
    }
  };
  const routeFile = (route) =>
    resolve(root, '.' + (route.endsWith('/') ? `${route}index.html` : route));
  for (const route of requiredRoutes)
    assert.ok(await hasFile(routeFile(route)), `Missing built route: ${route}`);
  for (const slug of publicProjectSlugs ?? []) {
    const path = routeFile(`/projects/${slug}/`);
    assert.ok(await hasFile(path), `Missing public project: ${slug}`);
    if (requireProjectMedia)
      assert.ok(
        [...elements(parse(await readFile(path, 'utf8')))].some(
          (element) =>
            element.tagName === 'img' &&
            element.attrs.some(({ name, value }) => name === 'src' && value),
        ),
        `${slug}: missing project media`,
      );
  }
  for (const slug of draftProjectSlugs)
    assert.ok(
      !(await hasFile(routeFile(`/projects/${slug}/`))),
      `Draft route leaked: ${slug}`,
    );
  for (const file of htmlFiles) {
    const html = await readFile(resolve(root, file), 'utf8');
    const url = new URL(
      '/' +
        file
          .split(sep)
          .join('/')
          .replace(/index\.html$/, ''),
      site,
    );
    const references = [...elements(parse(html))].flatMap((element) =>
      element.attrs.flatMap(({ name, value }) =>
        name === 'href' || name === 'src'
          ? [value]
          : name === 'srcset'
            ? srcsetUrls(value)
            : [],
      ),
    );
    for (const value of references) {
      const target = new URL(value, url);
      if (target.origin !== site) continue;
      const path = routeFile(decodeURIComponent(target.pathname));
      assert.ok(
        !relative(root, path).startsWith('..'),
        `${file}: link escapes output: ${value}`,
      );
      assert.ok(
        (await hasFile(path)) || (await hasFile(resolve(path, 'index.html'))),
        `${file}: broken local link: ${value}`,
      );
      const slug = target.pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1];
      if (slug && publicProjectSlugs)
        assert.ok(
          publicProjectSlugs.includes(slug),
          `${file}: non-public project link: ${slug}`,
        );
    }
  }
  console.log(
    `Built-site checks passed (${htmlFiles.length} HTML page${htmlFiles.length === 1 ? '' : 's'}; ${requiredRoutes.length} required route${requiredRoutes.length === 1 ? '' : 's'}).`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await checkSite();
