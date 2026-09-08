import { cpSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Call once after copying astro.config.mjs into a temporary fixture root. */
export function isolateFixtureCaches(root: string) {
  // Symlinked node_modules would otherwise share Astro's production content cache
  // and Vite's dependency cache across concurrent builds of different fixtures.
  cpSync(join(root, 'astro.config.mjs'), join(root, 'astro.fixture-base.mjs'));
  writeFileSync(
    join(root, 'astro.config.mjs'),
    `import base from './astro.fixture-base.mjs';
export default { ...base, cacheDir: './.astro-cache/', vite: { ...base.vite, cacheDir: './.vite-cache/' } };\n`,
  );
}
