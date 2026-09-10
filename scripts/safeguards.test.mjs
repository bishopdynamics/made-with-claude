import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
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
import test from 'node:test';

const project = fileURLToPath(new URL('..', import.meta.url));
const inertToken = () => ['npm', randomBytes(18).toString('hex')].join('_');
const inertEmail = () => ['fixture', 'example.invalid'].join('@');

function run(root, command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      CI: '',
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
      ...extraEnv,
    },
  });
  assert.equal(result.error, undefined, 'Subprocess must launch successfully');
  return { status: result.status, output: result.stdout + result.stderr };
}

function git(root, ...args) {
  const result = run(root, 'git', args);
  assert.equal(result.status, 0, 'Fixture Git command must succeed');
  return result;
}

function put(root, path, content) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

function fixture(t, { dependencies = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'hephaestion-safeguards-'));
  t.after(() => rmSync(root, { recursive: true }));
  git(root, 'init', '-q');
  git(root, 'config', 'user.name', 'Fixture');
  git(root, 'config', 'user.email', inertEmail());
  for (const path of [
    'scripts/privacy-check.mjs',
    'scripts/setup-hooks.mjs',
    '.secretlintrc.json',
    '.privacy-policy.json',
    '.githooks/pre-commit',
  ]) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(project, path), join(root, path));
  }
  // A trailing slash ignores directories, but not this dependency symlink.
  put(root, '.gitignore', '/node_modules\n');
  if (dependencies)
    symlinkSync(
      join(project, 'node_modules'),
      join(root, 'node_modules'),
      'dir',
    );
  git(root, 'add', '--', '.');
  if (dependencies) {
    assert.equal(
      run(root, 'git', ['check-ignore', '--quiet', '--', 'node_modules'])
        .status,
      0,
      'Fixture dependency symlink must remain ignored',
    );
    assert.equal(
      git(root, 'ls-files', '--cached', '--', 'node_modules').output,
      '',
      'Fixture dependency symlink must never enter the index',
    );
  }
  return root;
}

function scan(root, mode = '--staged', env) {
  return run(root, process.execPath, ['scripts/privacy-check.mjs', mode], env);
}

function rejectsPrivate(result, value, category) {
  assert.equal(result.status, 1, 'Privacy finding must reject the snapshot');
  assert.ok(result.output.includes(category), 'Expected finding category');
  assert.ok(
    !result.output.includes(value),
    'Diagnostics must redact matched values',
  );
}

test('staged credential is rejected even after working file is sanitized', (t) => {
  const root = fixture(t);
  const token = inertToken();
  put(root, 'notes.md', `token: ${token}\n`);
  git(root, 'add', '--', 'notes.md');
  put(root, 'notes.md', 'safe\n');
  rejectsPrivate(
    scan(root, '--staged', { DEBUG: '*' }),
    token,
    '@secretlint/secretlint-rule-npm',
  );
});

test('clean index passes with private unstaged content; full mode rejects it', (t) => {
  const root = fixture(t);
  put(root, 'notes.md', 'safe\n');
  git(root, 'add', '--', 'notes.md');
  const token = inertToken();
  put(root, 'notes.md', token);
  assert.equal(scan(root).status, 0);
  rejectsPrivate(scan(root, '--all'), token, '@secretlint/secretlint-rule-npm');
});

test('sensitive filenames reject; safe environment examples still scan content', (t) => {
  const root = fixture(t);
  for (const path of [
    '.env',
    'data.sqlite',
    'id_ed25519',
    'cookies.json',
    '.codex/auth.json',
  ])
    put(root, path, 'placeholder\n');
  git(root, 'add', '--', '.');
  assert.equal(scan(root).status, 1);
  git(
    root,
    'rm',
    '--cached',
    '--',
    '.env',
    'data.sqlite',
    'id_ed25519',
    'cookies.json',
    '.codex/auth.json',
  );
  put(root, '.env.example', 'PUBLIC_TITLE=Example\n');
  git(root, 'add', '--', '.env.example');
  assert.equal(scan(root).status, 0);
  const token = inertToken();
  put(root, '.env.example', token);
  git(root, 'add', '--', '.env.example');
  rejectsPrivate(scan(root), token, '@secretlint/secretlint-rule-npm');
});

test('personal information is detected without echoing it', (t) => {
  const root = fixture(t);
  const email = inertEmail();
  const home = ['', 'home', 'fixture-person', 'notes'].join('/');
  const identifier = ['123', '45', '6789'].join('-');
  put(root, 'notes.md', `${email}\n${home}\nSSN: ${identifier}\n`);
  git(root, 'add', '--', 'notes.md');
  const result = scan(root);
  rejectsPrivate(result, email, 'email');
  rejectsPrivate(result, home, 'home-path');
  rejectsPrivate(result, identifier, 'personal-identifier');
});

test('renames, deletions, and special path characters use exact index paths', (t) => {
  const root = fixture(t);
  put(root, 'original.md', 'safe\n');
  git(root, 'add', '--', 'original.md');
  git(root, 'commit', '-qm', 'fixture');
  const path = 'space [glob]*\n-leading.md';
  git(root, 'mv', '--', 'original.md', path);
  const token = inertToken();
  put(root, path, token);
  git(root, 'add', '--', path);
  rejectsPrivate(scan(root), token, '@secretlint/secretlint-rule-npm');
  git(root, 'commit', '-qm', 'fixture secret');
  git(root, 'rm', '--', path);
  assert.equal(scan(root).status, 0);
});

test('full mode includes untracked files and ignored-but-tracked content', (t) => {
  const root = fixture(t);
  put(root, 'tracked.md', 'safe\n');
  git(root, 'add', '--', 'tracked.md');
  put(root, '.gitignore', '/node_modules\ntracked.md\nignored.md\n');
  const token = inertToken();
  put(root, 'ignored.md', token);
  assert.equal(scan(root, '--all').status, 0);
  put(root, 'tracked.md', token);
  rejectsPrivate(scan(root, '--all'), token, '@secretlint/secretlint-rule-npm');
  put(root, 'tracked.md', 'safe\n');
  put(root, 'untracked.md', token);
  rejectsPrivate(scan(root, '--all'), token, '@secretlint/secretlint-rule-npm');
});

test('.bishop contents are permitted and inspected', (t) => {
  const root = fixture(t);
  put(root, '.bishop/project.json', '{}\n');
  git(root, 'add', '--', '.bishop');
  assert.equal(scan(root).status, 0);
  const token = inertToken();
  put(root, '.bishop/project.json', JSON.stringify({ value: token }));
  git(root, 'add', '--', '.bishop');
  rejectsPrivate(scan(root), token, '@secretlint/secretlint-rule-npm');
});

test('inline suppression comments cannot hide credentials', (t) => {
  const root = fixture(t);
  const token = inertToken();
  put(
    root,
    'notes.md',
    `<!-- ${['secretlint', 'disable'].join('-')} -->\n${token}\n`,
  );
  git(root, 'add', '--', 'notes.md');
  rejectsPrivate(scan(root), token, '@secretlint/secretlint-rule-npm');
});

test('exceptions are exact path, rule and line hash; unstaged policy cannot bypass index', (t) => {
  const root = fixture(t);
  const email = inertEmail();
  put(root, 'public.md', email);
  git(root, 'add', '--', 'public.md');
  const exception = {
    path: 'public.md',
    rule: 'email',
    lineHash: createHash('sha256').update(email).digest('hex'),
    reason: 'Synthetic documentation fixture',
  };
  put(
    root,
    '.privacy-policy.json',
    JSON.stringify({ exceptions: [exception] }),
  );
  rejectsPrivate(scan(root), email, 'email');
  git(root, 'add', '--', '.privacy-policy.json');
  assert.equal(scan(root).status, 0);
  put(root, 'public.md', `changed ${email}`);
  git(root, 'add', '--', 'public.md');
  rejectsPrivate(scan(root), email, 'email');
});

test('missing dependencies and invalid config fail closed without payloads', (t) => {
  const root = fixture(t, { dependencies: false });
  assert.equal(scan(root).status, 2);
  const token = inertToken();
  put(root, '.secretlintrc.json', token);
  git(root, 'add', '--', '.secretlintrc.json');
  const result = scan(root);
  assert.equal(result.status, 2);
  assert.ok(!result.output.includes(token));
});

test('over-limit input fails closed, and secret filenames are redacted', (t) => {
  const root = fixture(t);
  put(root, 'large.txt', Buffer.alloc(10 * 1024 * 1024 + 1, 65));
  assert.equal(scan(root, '--all').status, 2);
  rmSync(join(root, 'large.txt'));
  const token = inertToken();
  put(root, token, 'safe');
  git(root, 'add', '--', token);
  rejectsPrivate(scan(root), token, 'private-filename');
});

test('symlinks scan their targets without reading outside the repo', (t) => {
  const root = fixture(t);
  const home = ['', 'home', 'fixture-person', 'private'].join('/');
  symlinkSync(home, join(root, 'link'));
  git(root, 'add', '--', 'link');
  rejectsPrivate(scan(root), home, 'home-path');
});

test('hook setup installs idempotently and actual Git commit rejects a credential', (t) => {
  const root = fixture(t);
  const setup = () => run(root, process.execPath, ['scripts/setup-hooks.mjs']);
  assert.equal(setup().status, 0);
  assert.equal(setup().status, 0);
  assert.equal(
    git(root, 'config', '--get', 'core.hooksPath').output.trim(),
    '.githooks',
  );
  git(root, 'commit', '-qm', 'safe baseline');
  const token = inertToken();
  put(root, 'notes.md', token);
  git(root, 'add', '--', 'notes.md');
  const result = run(root, 'git', ['commit', '-qm', 'must fail']);
  rejectsPrivate(result, token, '@secretlint/secretlint-rule-npm');
  assert.ok(
    git(root, 'diff', '--cached', '--name-only').output.includes('notes.md'),
  );
});

test('hook setup respects CI and refuses configured or default hooks', (t) => {
  const root = fixture(t);
  const setup = (env) =>
    run(root, process.execPath, ['scripts/setup-hooks.mjs'], env);
  assert.equal(setup({ CI: 'true' }).status, 0);
  assert.equal(
    run(root, 'git', ['config', '--get', 'core.hooksPath']).status,
    1,
  );
  git(root, 'config', 'core.hooksPath', 'existing-hooks');
  assert.equal(setup().status, 2);
  assert.equal(
    git(root, 'config', '--get', 'core.hooksPath').output.trim(),
    'existing-hooks',
  );
  git(root, 'config', '--unset', 'core.hooksPath');
  put(root, '.git/hooks/pre-commit', '#!/bin/sh\nexit 0\n');
  assert.equal(setup().status, 2);
  assert.equal(
    readFileSync(join(root, '.git/hooks/pre-commit'), 'utf8'),
    '#!/bin/sh\nexit 0\n',
  );
});

test('hook setup discovers the common Git directory in linked worktrees', (t) => {
  const root = fixture(t);
  git(root, 'commit', '-qm', 'baseline');
  const linked = join(root, 'linked');
  git(root, 'worktree', 'add', '-qb', 'linked', linked);
  put(root, '.git/hooks/pre-commit', '#!/bin/sh\nexit 0\n');
  assert.equal(
    run(linked, process.execPath, ['scripts/setup-hooks.mjs']).status,
    2,
  );
  rmSync(join(root, '.git/hooks/pre-commit'));
  assert.equal(
    run(linked, process.execPath, ['scripts/setup-hooks.mjs']).status,
    0,
  );
});
