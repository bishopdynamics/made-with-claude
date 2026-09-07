import { parseArgs } from 'node:util';

process.env.ASTRO_TELEMETRY_DISABLED = '1';
const mode = process.argv[2];
if (!['dev', 'preview'].includes(mode))
  throw new Error('Expected dev or preview.');
// Astro's programmatic dev API preserves an inherited NODE_ENV. Select the
// command's mode explicitly so host settings cannot hide drafts or expose them.
process.env.NODE_ENV = mode === 'dev' ? 'development' : 'production';
const { values } = parseArgs({
  args: process.argv.slice(3),
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '4321' },
  },
});
const port = Number(values.port);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('Invalid port.');

// The documented programmatic API stays in this process. Astro 7's CLI
// automatically detaches servers when it detects an agent environment.
const astro = await import('astro');
const server = await astro[mode]({ server: { host: values.host, port } });
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await server.stop();
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
