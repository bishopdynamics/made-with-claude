import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import { markdownCodeOptions } from './scripts/markdown-code.mjs';

export default defineConfig({
  site: 'https://whatclaudemade.com',
  output: 'static',
  image: { service: { entrypoint: './scripts/image-service.mjs' } },
  server: { host: '127.0.0.1' },
  integrations: [expressiveCode(markdownCodeOptions)],
});
