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

const attribute = (element, name) =>
  element.attrs.find((attr) => attr.name === name)?.value;

function checkProjectPage(nodes, file) {
  const marked = (name) =>
    nodes.filter((node) => attribute(node, name) !== undefined);
  assert.equal(
    marked('data-project-page').length,
    1,
    `${file}: missing project page`,
  );
  assert.equal(
    attribute(marked('data-project-page')[0], 'data-project-draft'),
    'false',
    `${file}: draft page leaked`,
  );
  for (const tag of ['h1', 'main', 'article'])
    assert.equal(
      nodes.filter((node) => node.tagName === tag).length,
      1,
      `${file}: expected one ${tag}`,
    );
  assert.ok(
    !nodes.some(
      (node) =>
        attribute(node, 'name') === 'robots' &&
        /noindex/.test(attribute(node, 'content') ?? ''),
    ),
    `${file}: public project is noindex`,
  );
  const images = marked('data-gallery-image');
  assert.ok(images.length > 0, `${file}: missing project gallery images`);
  for (const link of images) {
    assert.equal(link.tagName, 'a', `${file}: gallery fallback must be a link`);
    assert.ok(attribute(link, 'href'), `${file}: missing full image link`);
    const image = [...elements(link)].find((node) => node.tagName === 'img');
    assert.ok(
      image &&
        attribute(image, 'src') &&
        attribute(image, 'alt') &&
        Number(attribute(image, 'width')) > 0 &&
        Number(attribute(image, 'height')) > 0,
      `${file}: incomplete thumbnail`,
    );
  }
  const dialogs = marked('data-gallery-dialog');
  assert.equal(dialogs.length, 1, `${file}: missing gallery dialog`);
  assert.equal(dialogs[0].tagName, 'dialog');
  assert.equal(
    attribute(dialogs[0], 'open'),
    undefined,
    `${file}: dialog starts open`,
  );
  assert.ok(
    nodes.some(
      (node) =>
        attribute(node, 'id') === attribute(dialogs[0], 'aria-labelledby'),
    ),
    `${file}: dialog has no label`,
  );
  assert.ok(
    ![...elements(dialogs[0])].some((node) => node.tagName === 'img'),
    `${file}: full images must load on demand`,
  );
  assert.equal(
    marked('data-gallery-close').length,
    1,
    `${file}: missing close control`,
  );
  for (const name of [
    'data-gallery-previous',
    'data-gallery-next',
    'data-strip-previous',
    'data-strip-next',
  ])
    assert.equal(
      marked(name).length,
      images.length > 1 ? 1 : 0,
      `${file}: redundant or missing navigation`,
    );
  for (const controls of marked('data-strip-controls'))
    assert.notEqual(
      attribute(controls, 'hidden'),
      undefined,
      `${file}: inactive strip controls exposed`,
    );
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

/**
 * Later slices extend requiredRoutes and pass project slugs/media expectations.
 * @param {{ directory?: string, requiredRoutes?: string[], publicProjectSlugs?: string[], draftProjectSlugs?: string[], requireProjectMedia?: boolean }} [options]
 */
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
    const nodes = [...elements(parse(html))];
    if (/^\/projects\/[^/]+\/$/.test(url.pathname))
      checkProjectPage(nodes, file);
    const references = nodes.flatMap((element) =>
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
