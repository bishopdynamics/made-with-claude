# SPEC: Site visit counter with GoatCounter

- **Status:** done
- **Request:** On 2026-09-10 the user asked for a "classic site visit counter". Showing the count on the page is not a priority; they want visits tracked somehow. After two research rounds they chose hosted, privacy-friendly analytics and picked GoatCounter, created the account, and recorded the supplied snippet in `docs/TODO.md`. They briefly considered the image-only mechanism, then chose the script version for its benefits (referrer and screen data, localhost skip, bot filtering) and approved this spec on 2026-09-10 with "let's do it".
- **Account:** GoatCounter site code `bishopdynamics`; count endpoint `https://bishopdynamics.goatcounter.com/count`. The dashboard login belongs to the user.

## Summary

Count page views on the published site with GoatCounter, a cookie-free analytics service that keeps history for as long as the account exists and can show a visible counter later without new code. The site ships a self-hosted copy of GoatCounter's versioned `count.js`, so the only runtime third-party request is the count beacon itself. The snippet appears only in production output, local previews are never counted, and tests plus the built-site checker guard both properties.

## Goals

- Every published page reports one pageview to the user's GoatCounter site when a real visitor loads it, including visitors without JavaScript.
- Development servers, test fixture builds served locally, and previews on loopback never count.
- No cookies, no consent banner, no personal data stored by this site; the footer states plainly that visits are counted.
- The site keeps its "assets are local" rule: the tracking script is vendored with a recorded checksum and license, like the fonts.
- The built-site checker proves every page carries exactly one counter and that no page loads a script from another origin.

## Non-Goals

- Displaying the count on the page. GoatCounter's visitor-counter endpoints make that a small follow-up once the user wants it.
- Custom events, campaign tracking, outbound-link tracking, or any analytics beyond pageviews.
- A Content-Security-Policy. GitHub Pages cannot set response headers, and a meta CSP is a separate decision.
- Filtering the user's own visits by IP. That is a dashboard setting (Settings → Tracking) the user can apply themselves; the spec records the option.
- Self-hosting GoatCounter's server, or any AWS-side counter. Those were the rejected alternatives in the research.

## Key Decisions

| Decision | Choice | Rationale / alternatives considered |
| --- | --- | --- |
| Provider | Hosted GoatCounter, site `bishopdynamics` | Free for personal use, cookie-free, history kept while the account is active, no-JS pixel, built-in per-page and site-total counter endpoints for a later visible counter. Umami Cloud keeps only 6 months on its free tier; Cloudflare needs another account and is ad-blocked; counter.dev is too coarse; Simple Analytics free keeps 30 days; Plausible/Pirsch/Fathom/Seline/Rybbit/Swetrix are trial-only; Beam shut down 2026-09-01. |
| Script hosting | Vendor `count.v5.js` into `public/goatcounter/` with a README recording bytes, SHA-256, upstream URL, and its license header | Matches the fonts precedent and the site rule that runtime assets are local; removes `gc.zgo.at` as a runtime origin. GoatCounter documents self-hosting and guarantees the `/count` endpoint stays compatible with any existing version. Alternative: load `https://gc.zgo.at/count.v5.js` with its published SRI hash, zero maintenance but a third-party script origin. Ad blockers block the beacon either way. |
| Production gating | Render the counter only when `import.meta.env.DEV` is false | Same switch that already excludes drafts. `astro build`/`preview` are production; `astro dev` is development. Belt and braces: `count.js` itself ignores localhost and common private networks unless `allow_local` is set, so a production preview on 127.0.0.1 still sends nothing. |
| Placement | End of `<body>` in the shared `Page.astro`, via a `VisitCounter.astro` component | Every route uses `Page.astro`, so every page is counted without per-page markup. Loading last keeps the script off the critical path. |
| Recorded path | Rely on the existing `<link rel="canonical">` | `count.js` prefers the canonical URL when it is on the same domain, so `/projects/?q=term` records as `/projects/` and paths never carry query noise. No `path` callback needed. |
| No-JS fallback | `<noscript>` image at `https://bishopdynamics.goatcounter.com/count?p=<canonical path>` | Counts visitors without JavaScript, which suits a "classic counter". The pixel cannot record referrer or screen size; that is acceptable. Static HTML cannot add a cache-buster, so repeat views within one browser cache may be under-counted; acceptable. |
| Shared canonical logic | Extract `resolveCanonical(canonical, site, fallbackPath)` into `src/lib/site-url.ts`, used by `Seo.astro` and `VisitCounter.astro` | The pixel path and the canonical link must agree; one helper prevents drift and is unit-testable. |
| Disclosure | One muted sentence in the footer: "Visits are counted with GoatCounter, without cookies or personal data." with GoatCounter linked to its privacy page | GoatCounter's own guidance is that a consent notice is probably unnecessary; a plain sentence is honest and costs nothing visually. The user may strike this line at review. |
| Own-visit exclusion | Document `#toggle-goatcounter` and the dashboard IP ignore list; do nothing in code | Both are GoatCounter features the user controls. Headless review browsers identify as `HeadlessChrome`, which GoatCounter's bot filter should exclude; verify in the dashboard after deployment rather than assume. |

## Design

### Vendored script

- `public/goatcounter/count.v5.js`: byte-identical copy of `https://gc.zgo.at/count.v5.js` (released 2025-06-09; GoatCounter's published SRI for it is `sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ`). Verify the downloaded bytes against that hash before committing.
- `public/goatcounter/README.md`: purpose, upstream URL, version, byte count, SHA-256 and SHA-384, the license named in the file header, and the note that updates are manual and optional because the endpoint stays compatible.
- The orchestrator vendors the file (network access) so the implementation worker needs none.

### `src/lib/site-url.ts`

```ts
/** Absolute canonical URL for a page: search and hash stripped, resolved against the site origin. */
export function resolveCanonical(canonical: string | URL | undefined, site: URL, fallbackPath: string): URL;
```

`Seo.astro` keeps its behavior and props but calls this helper. `Page.astro` computes the canonical once and passes it to both `Seo` and `VisitCounter`, or each calls the helper with identical inputs; either is fine as long as the pixel path equals the canonical pathname.

### `src/components/VisitCounter.astro`

Props: `{ canonical: URL }`. Renders nothing when `import.meta.env.DEV` is true. Otherwise:

```html
<script data-goatcounter="https://bishopdynamics.goatcounter.com/count" async src="/goatcounter/count.v5.js"></script>
<noscript><img src="https://bishopdynamics.goatcounter.com/count?p=<encoded canonical.pathname>" alt="" width="1" height="1"></noscript>
```

The endpoint and site code live in one constant in the component (or `site-url.ts`) so tests can import it. No `allow_local`, no settings object, no inline script.

### `SiteFooter.astro`

Add the disclosure sentence in the footer's existing muted style, linking "GoatCounter" to `https://www.goatcounter.com/help/privacy`.

### Built-site checker (`scripts/check-site.mjs`)

For every HTML page in `dist/`: exactly one `script[data-goatcounter]` whose `src` is a same-origin path that exists under `dist/`; exactly one `noscript img` pointing at the count endpoint whose `p` equals the page's canonical pathname; and every `<script src>` on the page is same-origin. Failing any of these fails `npm run build`.

### Tests

- `tests/site-url.test.ts` (new): `resolveCanonical` strips search/hash, resolves relative paths, and keeps absolute same-origin URLs.
- `tests/project-pages.test.ts`: fixture builds are production builds, so assert the counter script and pixel on the built public pages, the pixel path equals the canonical path, and the vendored file is copied into `dist/goatcounter/`. Extend the checker's negative cases: a page with the script removed, a page with an extra external script, and a pixel path mismatch must each fail `checkSite`.
- `tests/project-images.test.ts` (dev server): assert the served HTML contains no `goatcounter` reference.
- Existing draft-exclusion assertions are unchanged; drafts only exist in development output, which carries no counter.

### Verification and release

- `make check`.
- Local production preview in a browser with network capture: the page loads `/goatcounter/count.v5.js` with no JavaScript errors, and no request is made to `goatcounter.com`, proving loopback previews are not counted.
- After the user approves and the deploy succeeds: load the live page in a browser and confirm a request to `https://bishopdynamics.goatcounter.com/count`. The user checks the dashboard for the pageview and, if the headless review visit appears, decides whether to add an IP ignore rule.
- Mark the TODO entry done after the live check.

## Implementation Plan

1. **Vendor the script — (S), [serial], orchestrator.** Download `count.v5.js`, verify the SRI hash, write the README. **Owned files:** `public/goatcounter/count.v5.js`, `public/goatcounter/README.md`.
2. **Counter, gating, checker, tests — (M), [serial].** One Codex worker (`gpt-6-astra`/high by default; if hanuman `status` shows Codex exhausted, a Claude Opus worker) in the main checkout, no network. **Owned files:** `src/lib/site-url.ts` (new), `src/components/VisitCounter.astro` (new), `src/components/Seo.astro`, `src/layouts/Page.astro`, `src/components/SiteFooter.astro`, `src/styles/global.css` (footer note style only, if needed), `scripts/check-site.mjs`, `tests/site-url.test.ts` (new), `tests/project-pages.test.ts`, `tests/project-images.test.ts`. **Orchestrator-owned:** this spec, root addendum, task queue, handoff/memory, `docs/development.md`, `docs/launch.md`, `PROJECT.md`, `docs/DEFERRED.md`, TODO completion marking, browser verification, commits, and publication.

## Open Questions

- None blocking. The footer disclosure sentence is the one visible change; the user may strike it at approval.

## Deferred / Follow-ups

- Visible on-page counter using GoatCounter's `/counter/<path>.json` or `TOTAL` endpoints (requires enabling "Allow adding visitor counts" in the dashboard; responses cache for up to four hours).
- Manual refresh of the vendored `count.js` if a newer version adds something wanted.
- A meta Content-Security-Policy, if the site ever wants one, would need `connect-src`/`img-src` for `bishopdynamics.goatcounter.com`.

## Research

- [GoatCounter](https://www.goatcounter.com/) — free for "reasonable public usage"; no cookies; "probably doesn't require a GDPR consent notice".
- [Privacy policy](https://www.goatcounter.com/code/privacy) — per-view path, referrer, browser, OS, screen width, country, language; IP and User-Agent held in memory up to 8 hours for session grouping, never stored.
- [Host count.js yourself](https://www.goatcounter.com/code/countjs-host), [versions and SRI](https://www.goatcounter.com/code/countjs-versions), [tracking pixel](https://www.goatcounter.com/code/pixel), [path control](https://www.goatcounter.com/code/path), [skip own views](https://www.goatcounter.com/code/skip-dev), [visitor counter](https://www.goatcounter.com/code/visitor-counter), [CSP](https://www.goatcounter.com/code/csp).
- Alternatives reviewed 2026-09-10: Umami Cloud Hobby (100k events/month, 3 sites, 6-month retention), Cloudflare Web Analytics (free, needs a Cloudflare account, about 6 months aggregated, ad-blocked), counter.dev (unique daily visitors only), Simple Analytics free (30-day retention), Tinylytics ($7/month, has a hit-counter widget), trial-only Plausible/Pirsch/Seline/Rybbit/Swetrix, Beam (shut down).

## Change Log

- 2026-09-11 (UTC) — User approved publication after reviewing the footer. Pushed `b39d6ab`; Actions run 34563697928 succeeded. Live: every route carries one same-origin counter script (byte-identical to the vendored file) and a noscript pixel with its canonical path; the beacon to the count endpoint returned 200 from the live origin, and the headless review browser was flagged as automated (`b=153`) by `count.js`. TODO marked done; task removed from the queue. The user confirmed the first dashboard pageview from a phone on a mobile hotspot, appearing immediately. Accepted.
- 2026-09-10 — User approved the script-based design ("let's do it") after briefly considering image-only; the image-only revision is superseded. Implementation starts.
- 2026-09-10 — Interim revision to image-only at the user's request (superseded the same day).
- 2026-09-10 — created after the user chose GoatCounter and supplied the account snippet.
