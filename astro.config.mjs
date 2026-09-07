import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import { markdownCodeOptions } from './scripts/markdown-code.mjs';

export default defineConfig({
  site: 'https://madewithclaude.com',
  output: 'static',
  server: { host: '127.0.0.1' },
  integrations: [expressiveCode(markdownCodeOptions)],
});
