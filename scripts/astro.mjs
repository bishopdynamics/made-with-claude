// Keep local development and CI free of telemetry and global config writes.
process.env.ASTRO_TELEMETRY_DISABLED = '1';
await import('../node_modules/astro/bin/astro.mjs');
