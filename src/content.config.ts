import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { parseFrontmatter } from 'astro/markdown';
import { emitImageMetadata } from 'astro/assets/utils/node';
import { readdir, readFile, realpath } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { projectTaxonomy } from './data/project-taxonomy.ts';
import {
  createProjectSchema,
  localImagePath,
  validateProjectBody,
  validateProjectFiles,
} from './lib/project-schema.ts';

/** Small public-API loader: validation runs at sync, even with no project routes. */
function projectLoader(): Loader {
  return {
    name: 'validated-project-markdown',
    async load(context) {
      const { config, store, parseData, renderMarkdown, watcher, logger } =
        context;
      const base = resolve(
        fileURLToPath(new URL('content/projects/', config.srcDir)),
      );
      const assets = resolve(
        fileURLToPath(new URL('assets/projects/', config.srcDir)),
      );
      // Resolve the project root too: macOS and symlinked checkouts can give
      // realpath(image) a different prefix from the configured source directory.
      const canonicalAssets = resolve(
        await realpath(fileURLToPath(config.srcDir)),
        'assets/projects',
      );
      async function sync() {
        let files: string[];
        try {
          files = (await readdir(base, { recursive: true }))
            .filter((file) => /\.md$/i.test(file))
            .sort();
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
          store.clear();
          return;
        }
        const paths = validateProjectFiles(files);
        // Clear stale entries and reparse each sync; a changed policy cannot be bypassed by a content digest.
        store.clear();
        for (const [id, file] of paths) {
          const filePath = resolve(base, file);
          try {
            const { frontmatter, content: body } = parseFrontmatter(
              await readFile(filePath, 'utf8'),
            );
            // Validate paths/metadata before Astro image() transforms src into an import marker.
            const raw = createProjectSchema(
              localImagePath,
              projectTaxonomy,
            ).parse(frontmatter);
            validateProjectBody(raw.draft, body, file);
            for (const [index, image] of raw.images.entries()) {
              const target = resolve(dirname(filePath), image.src);
              const allowed = resolve(canonicalAssets, id) + sep;
              let actual: string;
              try {
                actual = await realpath(target);
              } catch {
                throw new Error(
                  `images.${index}.src: local image does not exist: ${image.src}`,
                );
              }
              if (!actual.startsWith(allowed))
                throw new Error(
                  `images.${index}.src: images must live in src/assets/projects/${id}/`,
                );
              try {
                const metadata = await emitImageMetadata(actual);
                if (!metadata || metadata.width < 1 || metadata.height < 1)
                  throw new Error('Image has no valid dimensions');
              } catch (error) {
                throw new Error(
                  `images.${index}.src: not a valid local image: ${image.src}`,
                  { cause: error },
                );
              }
            }
            // LoaderContext supplies a watcher only during development. Validate
            // drafts above in every mode, but never register their gallery or
            // Markdown asset imports in a production content store.
            if (raw.draft && !watcher) continue;
            const data = await parseData({ id, data: frontmatter, filePath });
            const rendered = await renderMarkdown(body, {
              fileURL: pathToFileURL(filePath),
            });
            store.set({
              id,
              data,
              body,
              filePath: relative(fileURLToPath(config.root), filePath)
                .split(sep)
                .join('/'),
              rendered,
              assetImports: rendered.metadata?.imagePaths,
            });
          } catch (error) {
            throw new Error(
              `${file}: ${error instanceof Error ? error.message : String(error)}`,
              { cause: error },
            );
          }
        }
      }
      await sync();
      if (watcher) {
        watcher.add([base, assets]);
        let pending = Promise.resolve();
        const refresh = (path: string) => {
          if (
            ![base, assets].some(
              (directory) =>
                path === directory || path.startsWith(directory + sep),
            )
          )
            return;
          pending = pending.then(sync).catch((error: unknown) => {
            // Never keep stale published data after a failed authoring edit.
            store.clear();
            logger.error(
              error instanceof Error ? error.message : String(error),
            );
          });
        };
        // Register each listener through Astro's tracked wrapper (chaining on()
        // returns the underlying watcher), so config reloads clean up all of them.
        for (const event of [
          'add',
          'change',
          'unlink',
          'addDir',
          'unlinkDir',
        ]) {
          watcher.on(event, refresh);
        }
      }
    },
  };
}

const projects = defineCollection({
  loader: projectLoader(),
  schema: ({ image }) => createProjectSchema(image(), projectTaxonomy),
});

export const collections = { projects };
