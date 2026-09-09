import { createRequire } from 'node:module';
import sharpService from 'astro/assets/services/sharp';

// Astro 7 caches the service across Vite-only restarts. Its lazy Sharp import
// otherwise retains a disposed Vite module runner and reports MissingSharp.
// Keep URL methods in Vite (they use import.meta.env), but bind the unchanged
// transform to Node's module loader for the lifetime of that cached service.
const { transform } = createRequire(import.meta.url)(
  'astro/assets/services/sharp',
).default;

export default { ...sharpService, transform };
