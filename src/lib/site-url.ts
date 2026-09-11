export const siteOrigin = new URL('https://whatclaudemade.com');
export const visitCounterEndpoint =
  'https://bishopdynamics.goatcounter.com/count';
export const visitCounterScript = '/goatcounter/count.v5.js';

/** Absolute canonical URL: resolved against site, with search and hash removed. */
export function resolveCanonical(
  canonical: string | URL | undefined,
  site: URL,
  fallbackPath: string,
): URL {
  const url = new URL(canonical ?? fallbackPath, site);
  url.search = '';
  url.hash = '';
  return url;
}

/** Count-image URL carrying the canonical pathname as a query value. */
export function visitCounterImageUrl(canonical: URL): string {
  const url = new URL(visitCounterEndpoint);
  url.search = new URLSearchParams({ p: canonical.pathname }).toString();
  return url.href;
}
