// Keep local development and CI free of telemetry and global config writes.
process.env.ASTRO_TELEMETRY_DISABLED = '1';
const command = process.argv[2];
if (command === 'build' || command === 'preview') {
  process.env.NODE_ENV = 'production';
} else if (command === 'dev') {
  process.env.NODE_ENV = 'development';
}
// Other CLI commands (check, sync, etc.) retain their inherited environment;
// only commands that serve or publish pages choose a rendering mode here.
await import('../node_modules/astro/bin/astro.mjs');
