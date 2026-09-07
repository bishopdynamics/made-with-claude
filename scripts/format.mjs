import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2];
if (!['--write', '--check'].includes(mode)) {
  console.error('Usage: node scripts/format.mjs --write|--check');
  process.exit(2);
}
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL('../node_modules/prettier/bin/prettier.cjs', import.meta.url),
    ),
    mode,
    'src/**/*.{astro,md,ts,css}',
    'scripts/**/*.mjs',
    'package.json',
    'astro.config.mjs',
    'tsconfig.json',
    '.prettierrc.json',
    '.secretlintrc.json',
    '.privacy-policy.json',
    '.github/workflows/check.yml',
  ],
  { stdio: 'inherit', cwd: fileURLToPath(new URL('..', import.meta.url)) },
);
process.exit(result.status ?? 2);
