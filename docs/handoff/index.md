# Handoff Main Index

## Current

- **2026-09-11 UTC — GoatCounter visit counter published and verified live.** User approved ("go"); pushed `b39d6ab` to `github/main`; Actions run `34563697928` succeeded. Live checks: all four routes carry one same-origin counter script (byte-identical to `public/goatcounter/count.v5.js`) and a noscript pixel with the canonical path; a real browser load produced `POST https://bishopdynamics.goatcounter.com/count?p=…&b=153` → 200 (`b=153` is `count.js`'s webdriver bot flag, so headless review visits should not pollute stats); no JS errors. Minor console warnings come from the YouTube iframe `allow` list (`web-share` unrecognized; `allow` overrides `allowfullscreen`), harmless. Remaining user step: confirm the first pageview in the dashboard.
- Implementation history for this feature: After the Continuum video went live (see `archive_14.md`), the user asked for a site visit counter, chose hosted privacy-friendly analytics after two research rounds, created a GoatCounter account (site code `bishopdynamics`), briefly chose image-only, then reverted to the script version and approved `docs/spec/FEATURE_SPEC_visit_counter.md`. They asked whether the CDN matters for tracking; it does not, the beacon to the count endpoint is the tracking, and GoatCounter documents self-hosting `count.js`.
- Implementation: orchestrator vendored `public/goatcounter/count.v5.js` (8996 bytes, SHA-384 matches GoatCounter's published SRI, ISC header) with a README. Codex `gpt-6-astra`/high worker `visit-counter-a1fcd5` (main checkout, no network) added `src/lib/site-url.ts` (`resolveCanonical`, endpoint/script constants, `visitCounterImageUrl`), `src/components/VisitCounter.astro` (production-only script + noscript pixel, last child of body), shared canonical use in `Seo.astro`/`Page.astro`, the footer disclosure, `checkVisitCounter` in `scripts/check-site.mjs` (default on; synthetic fixtures pass `visitCounter: false`), and tests (`tests/site-url.test.ts`, page-build assertions plus six checker negative cases, dev-server absence). Two brief gaps were resolved by `send`: ownership of `tests/project-schema.test.ts`, and a marker-based dev-absence assertion so the footer sentence stays in dev. Orchestrator glue: `.ts` import extensions, `public` excluded in `tsconfig.json` (removes 4 hints from the vendored JS).
- Verification: parent `make check` 55 tests, 0 errors/warnings/hints, privacy 0 findings on 319 snapshots, production build 5 pages. Browser on `npm run preview` port 4322: `/goatcounter/count.v5.js` 200 same-origin, `window.goatcounter.filter()` returns `localhost`, console `goatcounter: not counting because of: localhost`, zero requests to goatcounter.com, no JS errors, footer text/link present, no overflow at 1280 or 400px.
- **Next:** nothing in flight. TODO marked done; the task is removed from the queue, which now leads with the two user-assessment reviews and paused BeamVM. Dashboard IP-ignore remains the user's option for own visits. Docs (`development.md`, `launch.md`, `PROJECT.md`) record the counter.
- Also in TODO (unspec'd, user-owned): rename the GitHub repo `made-with-claude` → `what-claude-made`. Answered: GitHub redirects git/web; Actions unaffected; Pages custom domain/cert unaffected (DNS points at `bishopdynamics.github.io`); local fix is `git remote set-url`; five docs mention the old name. Treat as a chore when the user renames it.
- Codex budget: 91% of the weekly window used as of 2026-09-10 (resets 2026-09-17 06:12 UTC); check hanuman `status` before dispatching.
- Worktree/worker audit: only the main worktree; hanuman runs `project-video-142c7f` and `visit-counter-a1fcd5` are finished/closed with no worktrees or branches. Preview server on 4322 stopped; browser sessions closed.

## Archives

- [archive_14.md](archive_14.md) — Continuum video publication, subtitle question, and visit-counter research.
- [archive_13.md](archive_13.md) — Continuum video spec approval and pre-implementation wrap.
- [archive_12.md](archive_12.md) — live HTTPS launch, CI correction and final verification.
- [archive_11.md](archive_11.md) — source-availability feature and pre-launch checkpoint.
- [archive_10.md](archive_10.md) — local-image fix and FantasyBoy/BeamVM acceptance checkpoint.
- [archive_9.md](archive_9.md) — six-project parallel draft batch and missing media.
- [archive_8.md](archive_8.md) — BeamVM gallery and shared draft metadata verification.
- [archive_7.md](archive_7.md) — FantasyBoy first draft/gallery and original-date intake.
- [archive_6.md](archive_6.md) — domain correction and BeamVM draft verification before its pause.
- [archive_5.md](archive_5.md) — Continuum first-pass media verification before v1 acceptance.
- [archive_4.md](archive_4.md) — previous session wrap before slice 4 acceptance.
- [archive_3.md](archive_3.md) — completed implementation checkpoint and detailed slice 4 verification.
- [archive_2.md](archive_2.md) — Hephaestion first run and early design discussion.
- [archive_1.md](archive_1.md) — inherited template history; reference only.
