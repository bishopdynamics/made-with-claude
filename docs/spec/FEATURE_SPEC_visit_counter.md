# SPEC: Site visit counter with GoatCounter

- **Status:** draft
- **Request:** On 2026-09-10 the user asked for a "classic site visit counter". Showing the count on the page is not a priority; they want visits tracked somehow. After two research rounds they chose hosted, privacy-friendly analytics and picked GoatCounter, created the account, and recorded the supplied snippet in `docs/TODO.md`. They then decided to use **only GoatCounter's no-JavaScript image**, with no tracking script at all.
- **Account:** GoatCounter site code `bishopdynamics`; count endpoint `https://bishopdynamics.goatcounter.com/count`. The dashboard login belongs to the user.

## Summary

Count page views on the published site with a single GoatCounter tracking image on every page. No JavaScript is added to the site. The image is rendered only by the publishing build in GitHub Actions, so local development, test fixture builds, and loopback previews never count. GoatCounter is cookie-free, keeps history for as long as the account exists, and can show a visible counter later without new code.

## Goals

- Every published page requests one GoatCounter count image when a visitor loads it, JavaScript or not.
- Local builds, development servers, and previews never contain the image, so nothing on the user's machine or in CI checks of pull requests is counted.
- No cookies, no consent banner, no personal data stored by this site; the footer states plainly that visits are counted.
- No third-party script. The only outbound request is the image itself.
- The built-site checker proves the publishing build carries exactly one count image per page with the page's canonical path, and that non-publishing builds carry none.

## Non-Goals

- GoatCounter's `count.js`, referrer or screen-size data, custom events, campaigns, or outbound-link tracking. The image cannot record a referrer; that is accepted.
- Displaying the count on the page. GoatCounter's visitor-counter endpoints make that a small follow-up.
- Cache-busting the image. Static HTML cannot vary the URL per load; repeat views of one page within a browser's cache may be under-counted. Accepted for a classic counter.
- A Content-Security-Policy. GitHub Pages cannot set response headers.
- Filtering the user's own visits by IP. That is a dashboard setting (Settings → Tracking) the user controls.

## Key Decisions

| Decision | Choice | Rationale / alternatives considered |
| --- | --- | --- |
| Provider | Hosted GoatCounter, site `bishopdynamics` | Free for personal use, cookie-free, history kept while the account is active, documented image endpoint, built-in counter endpoints for a later visible count. Umami Cloud keeps 6 months on its free tier; Cloudflare needs another account and is ad-blocked; counter.dev is too coarse; Simple Analytics free keeps 30 days; Plausible/Pirsch/Fathom/Seline/Rybbit/Swetrix are trial-only; Beam shut down 2026-09-01. |
| Mechanism | Image only: `<img src="https://bishopdynamics.goatcounter.com/count?p=…&t=…">` | User decision. No script to vendor, no third-party code on the page, works without JavaScript. Trade-offs, all accepted: no referrer or screen size, possible under-count from image caching, and no built-in localhost skip. |
| Publishing gate | Render the image only when the build environment sets `SITE_VISIT_COUNTER=goatcounter`; the workflow sets it for the main-branch check-and-deploy run only | The script's localhost skip is gone, so the gate must be explicit. Local `make check`/`npm run build`/`npm run preview` omit the variable and therefore the image; pull-request CI checks omit it too. Alternatives: gate on `import.meta.env.DEV` alone (previews would count), or rely on the dashboard IP-ignore list (dynamic IPs, and it would not cover CI). |
| Recorded path | The page's canonical pathname, from the same logic as `<link rel="canonical">` | Keeps `/projects/?q=term` recorded as `/projects/`. A shared helper prevents the pixel and canonical link from drifting. |
| Title | Pass the page title as `t` | Makes the dashboard readable without extra requests. |
| Placement | End of `<body>` in `Page.astro`, via `VisitCounter.astro` | Every route uses `Page.astro`. A one-pixel `alt=""` image at the end of the body is invisible and does not affect layout. |
| Disclosure | One muted sentence in the footer: "Visits are counted with GoatCounter, without cookies or personal data." with GoatCounter linked to its privacy page | GoatCounter's own guidance is that a consent notice is probably unnecessary; a plain sentence is honest and costs nothing visually. The user may strike this line at review. |
| Own-visit exclusion | Document the dashboard IP ignore list; do nothing in code | `#toggle-goatcounter` needs the script, so it no longer applies. Headless review browsers identify as `HeadlessChrome`, which GoatCounter's server-side bot filter should exclude; verify in the dashboard rather than assume. |

## Design

### `src/lib/site-url.ts`

```ts
/** Absolute canonical URL for a page: search and hash stripped, resolved against the site origin. */
export function resolveCanonical(canonical: string | URL | undefined, site: URL, fallbackPath: string): URL;
/** Whether the current build is the publishing build that should emit the visit counter. */
export function visitCounterEnabled(env: NodeJS.ProcessEnv): boolean; // env.SITE_VISIT_COUNTER === 'goatcounter'
/** GoatCounter count-image URL for a page. */
export function visitCounterImageUrl(canonical: URL, title: string): string;
```

`visitCounterImageUrl` returns `https://bishopdynamics.goatcounter.com/count?p=<pathname>&t=<title>` built with `URLSearchParams`, so both values are encoded. The endpoint is a single exported constant. `Seo.astro` keeps its behavior and props but uses `resolveCanonical`; `Page.astro` computes the canonical and page title once and passes them to both `Seo` and `VisitCounter`, or each derives them from identical inputs.

### `src/components/VisitCounter.astro`

Props: `{ canonical: URL; title: string }`. Renders nothing unless `visitCounterEnabled(process.env)` is true at build time and `import.meta.env.DEV` is false. Otherwise renders exactly:

```html
<img class="visit-counter" src="…/count?p=…&t=…" alt="" width="1" height="1" decoding="async" data-visit-counter="goatcounter">
```

No `loading="lazy"` (the image is at the end of the body and must load). A tiny style keeps it out of layout: `.visit-counter { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }`.

### Workflow

In `.github/workflows/*.yml`, the `check` job's `npm run check` step gains `env: SITE_VISIT_COUNTER: ${{ github.ref == 'refs/heads/main' && github.event_name != 'pull_request' && 'goatcounter' || '' }}` (or an equivalent step-level condition), so only the artifact that will be deployed contains the image. The privacy screen, tests, and format checks are unaffected by the variable.

### `SiteFooter.astro`

Add the disclosure sentence in the footer's existing muted style, linking "GoatCounter" to `https://www.goatcounter.com/code/privacy`.

### Built-site checker (`scripts/check-site.mjs`)

Accept a `visitCounter` option (default: derived from `SITE_VISIT_COUNTER` in the checker's environment). When enabled: every HTML page has exactly one `img[data-visit-counter]`, its `src` origin is `https://bishopdynamics.goatcounter.com`, its path is `/count`, and its `p` equals the page's canonical pathname. When disabled: no page contains `goatcounter` at all. Either failure fails `npm run build`.

### Tests

- `tests/site-url.test.ts` (new): `resolveCanonical` strips search/hash and resolves relative paths; `visitCounterEnabled` is true only for the exact value; `visitCounterImageUrl` encodes path and title.
- `tests/project-pages.test.ts`: the second fixture build already runs in production mode; set `SITE_VISIT_COUNTER=goatcounter` in its environment and assert the image on each public page with the right `p` and `t`, then run `checkSite` with `visitCounter: true`. The warm build keeps the variable unset and asserts no `goatcounter` string appears in its output. Add checker negative cases: image removed, `p` mismatched, and an image present while the option is disabled.
- `tests/project-images.test.ts` (dev server): assert the served HTML contains no `goatcounter` reference even with the variable set.

### Verification and release

- `make check` locally (no variable): build has no image, checker passes in disabled mode.
- `SITE_VISIT_COUNTER=goatcounter npm run build` locally, then a browser pass over the preview: exactly one image per page, `alt=""`, no layout shift, and the request to `bishopdynamics.goatcounter.com/count` returns a 200 with a cacheability header worth recording in the dev guide. This preview does count once; the user may add their IP to the ignore list first.
- After approval and deployment: confirm the live page's image URL and a 200 response; the user confirms the pageview in the dashboard. Mark the TODO entry done after the live check.

## Implementation Plan

1. **Counter image, gating, workflow, checker, tests — (M), [serial].** One Codex worker (`gpt-6-astra`/high by default; a Claude Opus worker if hanuman `status` shows Codex exhausted) in the main checkout, no network. **Owned files:** `src/lib/site-url.ts` (new), `src/components/VisitCounter.astro` (new), `src/components/Seo.astro`, `src/layouts/Page.astro`, `src/components/SiteFooter.astro`, `src/styles/global.css`, `.github/workflows/` (the existing workflow file), `scripts/check-site.mjs`, `tests/site-url.test.ts` (new), `tests/project-pages.test.ts`, `tests/project-images.test.ts`. **Orchestrator-owned:** this spec, root addendum, task queue, handoff/memory, `docs/development.md`, `docs/launch.md`, `PROJECT.md`, `docs/DEFERRED.md`, TODO completion marking, browser verification, commits, and publication.

## Open Questions

- None blocking. The footer disclosure sentence is the one visible change; the user may strike it at approval.

## Deferred / Follow-ups

- Visible on-page counter using GoatCounter's `/counter/<path>.json` or `TOTAL` endpoints (requires enabling "Allow adding visitor counts" in the dashboard; responses cache for up to four hours).
- Referrer data, if ever wanted, would require the script; this spec deliberately excludes it.

## Research

- [GoatCounter](https://www.goatcounter.com/) — free for "reasonable public usage"; no cookies; "probably doesn't require a GDPR consent notice".
- [Tracking pixel](https://www.goatcounter.com/code/pixel) — `<img src="https://MYCODE.goatcounter.com/count?p=/path">`; parameters `p`, `t`, `r`, `e`, `q`, `s`, `b`; cannot record referrer or screen size and "may also increase the number of bot requests".
- [Privacy policy](https://www.goatcounter.com/code/privacy) — per-view path, browser, OS, screen width, country, language; IP and User-Agent held in memory up to 8 hours for session grouping, never stored.
- [Skip own views](https://www.goatcounter.com/code/skip-dev) — IP ignore list under Settings → Tracking. [Visitor counter](https://www.goatcounter.com/code/visitor-counter) for the deferred visible count.
- Alternatives reviewed 2026-09-10: Umami Cloud Hobby (100k events/month, 3 sites, 6-month retention), Cloudflare Web Analytics (free, needs a Cloudflare account, about 6 months aggregated, ad-blocked), counter.dev (unique daily visitors only), Simple Analytics free (30-day retention), Tinylytics ($7/month, has a hit-counter widget), trial-only Plausible/Pirsch/Seline/Rybbit/Swetrix, Beam (shut down).

## Change Log

- 2026-09-10 — Revised to image-only at the user's request: no `count.js`, no vendored script, and an explicit publishing-build gate (`SITE_VISIT_COUNTER`) because the script's localhost skip no longer applies. Awaiting approval.
- 2026-09-10 — created after the user chose GoatCounter and supplied the account snippet.
