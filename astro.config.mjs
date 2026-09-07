import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://madewithclaude.com',
  output: 'static',
  server: { host: '127.0.0.1' },
});
