import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readlinkSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

// Prevent dependency debug logging from exposing source text or scanner internals.
delete process.env.DEBUG;
let phase = 'startup';
const MAX_BYTES = 10 * 1024 * 1024;
const presetId = '@secretlint/secretlint-rule-preset-recommend';
const requiredConfig = {
  rules: [
    {
      id: presetId,
      rules: [
        { id: '@secretlint/secretlint-rule-filter-comments', disabled: true },
      ],
    },
  ],
};
const patterns = [
  [
    'email',
    /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}/gi,
  ],
  [
    'home-path',
    /(?:\/(?:home|Users)\/[A-Za-z0-9._-]+|[A-Z]:\\(?:Users|Documents and Settings)\\[A-Za-z0-9._-]+)/gi,
  ],
  [
    'personal-identifier',
    /\b(?:ssn|social\s+security(?:\s+number)?)\s*[:=]\s*["']?\d{3}[- ]?\d{2}[- ]?\d{4}\b/gi,
  ],
];

function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error('git');
  return result.stdout;
}

function nulPaths(buffer) {
  // Reject invalid UTF-8 filenames instead of silently scanning a different path.
  return new TextDecoder('utf-8', { fatal: true })
    .decode(buffer)
    .split('\0')
    .filter(Boolean);
}

function indexEntries(root) {
  return nulPaths(git(['ls-files', '--stage', '-z'], root)).map((entry) => {
    const tab = entry.indexOf('\t');
    const [mode, oid, stage] = entry.slice(0, tab).split(' ');
    if (tab < 0 || stage !== '0' || !/^[a-f0-9]{40,64}$/.test(oid))
      throw new Error('index');
    return { path: entry.slice(tab + 1), mode, oid };
  });
}

function blob(root, entry) {
  if (!['100644', '100755', '120000'].includes(entry.mode))
    throw new Error('unsupported index entry');
  const size = Number(git(['cat-file', '-s', entry.oid], root).toString());
  if (!Number.isSafeInteger(size) || size > MAX_BYTES) throw new Error('size');
  return git(['cat-file', 'blob', entry.oid], root);
}

function workFile(root, path) {
  const file = resolve(root, path);
  let stat;
  try {
    stat = lstatSync(file);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
  if (stat.isSymbolicLink()) return Buffer.from(readlinkSync(file));
  if (!stat.isFile() || stat.size > MAX_BYTES)
    throw new Error('unsupported working file');
  return readFileSync(file);
}

function readPolicy(buffer) {
  const policy = JSON.parse(buffer.toString('utf8'));
  if (!Array.isArray(policy.exceptions) || Object.keys(policy).length !== 1)
    throw new Error('policy');
  for (const item of policy.exceptions) {
    if (
      Object.keys(item).sort().join() !== 'lineHash,path,reason,rule' ||
      typeof item.path !== 'string' ||
      item.path.startsWith('/') ||
      item.path.split('/').includes('..') ||
      !patterns.some(([rule]) => rule === item.rule) ||
      !/^[a-f0-9]{64}$/.test(item.lineHash) ||
      typeof item.reason !== 'string' ||
      !item.reason.trim()
    )
      throw new Error('exception');
  }
  return policy;
}

function filenameRule(path) {
  const name = basename(path).toLowerCase();
  if (/^\.env(?:\.|$)/.test(name) && !/\.(?:example|sample)$/.test(name))
    return 'sensitive-filename';
  if (
    /\.(?:pem|key|p12|pfx|keystore|sqlite3?|db|dump|bak)$/.test(name) ||
    /^(?:id_(?:rsa|dsa|ecdsa|ed25519)(?:\.pub)?|\.netrc|\.npmrc\.local|credentials(?:\..*)?|secrets?(?:\..*)?|sessions?(?:\..*)?|cookies?(?:\..*)?|.*(?:dump|backup)\.sql)$/.test(
      name,
    )
  )
    return 'sensitive-filename';
  if (
    /(?:^|\/)(?:\.ssh|\.aws|\.gnupg|\.agent-worktrees)(?:\/|$)/.test(path) ||
    /(?:^|\/)(?:\.claude|\.codex)\/(?:auth\.json|history\.jsonl|sessions|projects|settings\.local\.json)(?:\/|$)/.test(
      path,
    )
  )
    return 'local-agent-state';
  return undefined;
}

async function main() {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !['--all', '--staged'].includes(mode))
    throw new Error('arguments');
  phase = 'Git discovery';
  const root = git(['rev-parse', '--show-toplevel']).toString().trim();
  phase = 'index enumeration';
  const entries = indexEntries(root);
  const byPath = new Map(entries.map((entry) => [entry.path, entry]));
  const fromIndex = (path) =>
    byPath.has(path) ? blob(root, byPath.get(path)) : undefined;
  phase = 'scanner config';
  const configBytes =
    mode === '--staged'
      ? fromIndex('.secretlintrc.json')
      : workFile(root, '.secretlintrc.json');
  if (
    !configBytes ||
    !isDeepStrictEqual(JSON.parse(configBytes.toString()), requiredConfig)
  )
    throw new Error('scanner config');
  phase = 'privacy policy';
  const indexPolicyBytes = fromIndex('.privacy-policy.json');
  if (mode === '--staged' && !indexPolicyBytes)
    throw new Error('missing staged policy');
  const indexPolicy = indexPolicyBytes
    ? readPolicy(indexPolicyBytes)
    : { exceptions: [] };
  const workingPolicy =
    mode === '--all'
      ? readPolicy(workFile(root, '.privacy-policy.json'))
      : indexPolicy;
  phase = 'scanner dependencies';
  const { lintSource } = await import('@secretlint/core');
  const { rules } =
    await import('@secretlint/secretlint-rule-preset-recommend');
  // Register scanner rules directly: core's preset runner does not honor nested disabled flags.
  const enabledRules = rules.filter(
    (rule) => rule.meta.id !== '@secretlint/secretlint-rule-filter-comments',
  );
  if (!enabledRules.length) throw new Error('empty preset');
  const config = {
    rules: enabledRules.map((rule) => ({ id: rule.meta.id, rule })),
  };
  let findings = 0;
  let scanned = 0;

  async function scan(path, buffer, snapshot, policy) {
    // Scan decodable strings even in binary files; this cannot inspect pixels or archives.
    const content = buffer.toString(
      buffer[0] === 0xff && buffer[1] === 0xfe ? 'utf16le' : 'utf8',
    );
    const pathResult = await lintSource({
      source: { content: path, filePath: 'filename.txt', contentType: 'text' },
      options: { config, maskSecrets: true, noPhysicFilePath: true },
    });
    const privatePath =
      pathResult.messages.length ||
      patterns.some(([, pattern]) => new RegExp(pattern).test(path));
    const label = privatePath
      ? `[redacted filename ${createHash('sha256').update(path).digest('hex').slice(0, 12)}]`
      : JSON.stringify(path);
    function report(rule, line) {
      findings++;
      console.error(`${label}:${line} [${snapshot}] ${rule}`);
    }
    if (privatePath) report('private-filename', 1);
    const filenameFinding = filenameRule(path);
    if (filenameFinding) report(filenameFinding, 1);
    const lines = content.split('\n');
    for (const [rule, pattern] of patterns) {
      for (const match of content.matchAll(pattern)) {
        const line = content.slice(0, match.index).split('\n').length;
        const lineHash = createHash('sha256')
          .update(lines[line - 1])
          .digest('hex');
        if (
          !policy.exceptions.some(
            (item) =>
              item.path === path &&
              item.rule === rule &&
              item.lineHash === lineHash,
          )
        )
          report(rule, line);
      }
    }
    const result = await lintSource({
      source: {
        content,
        filePath: path,
        ext: extname(path),
        contentType: 'text',
      },
      options: { config, maskSecrets: true, noPhysicFilePath: true },
    });
    for (const message of result.messages)
      report(message.ruleId, message.loc.start.line);
    scanned++;
  }

  phase = 'index content';
  for (const entry of entries) {
    await scan(entry.path, blob(root, entry), 'index', indexPolicy);
  }
  if (mode === '--all') {
    phase = 'working content';
    // --cached retains tracked paths even when .gitignore also matches them.
    const paths = new Set(
      nulPaths(
        git(
          ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
          root,
        ),
      ),
    );
    for (const path of paths) {
      const bytes = workFile(root, path);
      if (bytes !== undefined)
        await scan(path, bytes, 'working', workingPolicy);
    }
  }
  console.log(
    `Privacy check: ${scanned} file snapshots scanned; ${findings} finding(s).`,
  );
  if (findings) process.exitCode = 1;
}

main().catch(() => {
  // Exception messages, stacks, Git stderr, and library match payloads may contain secrets.
  console.error(
    `Privacy check could not complete (${phase}). Check Git state, file sizes (10 MiB maximum), policy/config, and installed dependencies; run make setup. No matched values are printed.`,
  );
  process.exitCode = 2;
});
