import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function git(args, allowMissing = false) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (
    result.error ||
    (result.status !== 0 && !(allowMissing && result.status === 1))
  ) {
    throw new Error('Git hook configuration could not be read or updated.');
  }
  return result.stdout.trim();
}

try {
  if (process.env.CI && process.env.CI !== 'false' && process.env.CI !== '0') {
    console.log('CI detected; hook installation skipped.');
  } else {
    const root = git(['rev-parse', '--show-toplevel']);
    const configured = git(['config', '--get-all', 'core.hooksPath'], true);
    if (configured && configured !== '.githooks') {
      throw new Error(
        'Existing core.hooksPath differs from .githooks; resolve it manually.',
      );
    }
    const defaultHooks = git(['rev-parse', '--git-common-dir']);
    if (!configured && existsSync(resolve(defaultHooks, 'hooks/pre-commit'))) {
      throw new Error(
        'Existing default pre-commit hook found; resolve it manually.',
      );
    }
    const hook = resolve(root, '.githooks/pre-commit');
    if (!existsSync(hook))
      throw new Error('Project pre-commit hook is missing.');
    chmodSync(hook, 0o755);
    git(['config', '--local', 'core.hooksPath', '.githooks']);
    console.log('Installed .githooks/pre-commit.');
  }
} catch (error) {
  console.error(`Hook setup failed: ${error.message}`);
  process.exitCode = 2;
}
