# SPEC: Reliable repository-local image serving

- **Status:** in-review (implemented and verified)
- **Approval record:** On 2026-09-09 the user reported broken Vintage Vault screenshots and reiterated that all website images must be copied into this repository, independent of source repositories. This authorizes the image-loading fix and its regression coverage.

## Summary

Repair thumbnail failures in a long-running local preview and verify that the site's copied assets are self-contained. Preserve existing content, media, layout, and publication boundaries.

## Goals

- Vintage Vault thumbnails and full-size images load in the normal local preview.
- Image transformation survives a Vite restart before the first Sharp transform.
- Tests fetch and decode actual image responses from a copied checkout using only repository media and installed dependencies.
- The existing inline animation preserves its timing and loop behavior.

## Non-Goals

- Remote image hotlinks, symlinks to source projects, recapturing or editing screenshots, disabling image optimization, or publishing drafts.
- General live-content/cache refactoring unrelated to the reproduced image-service defect.
- Patching installed dependencies or adding persistent diagnostic endpoints.

## Key Decisions

| Decision | Choice | Evidence / rationale |
| --- | --- | --- |
| Asset ownership | Retain the three committed regular JPEG copies in `src/assets/projects/vintage-vault/` | Originals return HTTP 200 and hashes match provenance; missing copies were not the failure. All 14 existing project media files were audited as regular files inside this repo. |
| Failure | Cached Astro image service retains a disposed Vite module runner | Existing process's cached transform failed with MissingSharp while direct Sharp import and a fresh service succeeded. Deleting the stale service restored a thumbnail immediately. |
| Durable fix | Custom service keeps Astro's Vite URL/validation methods and uses its unchanged Sharp transform loaded by Node | A Vite-only restart reproduces the failure; the Node-bound transform survives it without private-global cache mutation or dependency patches. |
| Dependency | Pin the existing Sharp 0.35.4 directly as a dev dependency | The new regression imports it to decode image bytes. This makes the dependency explicit; no version upgrade is involved and the pin is not the causal fix. |
| Verification | HTTP-level restart regression with isolated copied source/media | HTML-only and cached production-build checks missed the broken derivative endpoint. |

## Design

`scripts/image-service.mjs` uses Astro's existing service methods and binds only `transform` through Node's module loader. `astro.config.mjs` selects that entrypoint. The default transformation/animation behavior remains intact. Existing fixture builders copy the helper explicitly.

The regression copies source/assets/config into a temporary checkout, serves it on an unused loopback port, reads Vintage Vault HTML without first fetching derivatives, triggers a Vite-only restart, and requests the originals and all gallery src/srcset URLs. Original URLs must resolve within the copied checkout and return identical bytes. Derivatives must decode as WebP with the requested dimensions. The real inline GIF must remain animated with unchanged loop and total duration.

## Implementation Plan

1. **Image service and regression — (M), [serial].** Native Astra/high worker; parent independently diagnoses the existing process and reviews the fix.
   - **Worker-owned:** `astro.config.mjs`, `scripts/image-service.mjs`, `package.json`, `package-lock.json`, `tests/project-images.test.ts`, and fixture copy lists in `tests/project-{catalog,pages,schema}.test.ts`.
   - **Orchestrator-owned:** this spec, project media policy, development/evidence docs, queue/handoff/memory, and temporary diagnostic probes (removed before final checks).
   - **Verification:** targeted before/after regression, worker and parent `make check`, existing-preview thumbnails/gallery checks, and tracked-asset ownership audit.

## Open Questions

None for the reproduced defect. The separate stale-content-list behavior remains a deferred investigation.

## Deferred / Follow-ups

- Reassess the service wrapper when upgrading the pinned Astro version; retain the restart/image-byte regression even if the workaround becomes unnecessary.

## Change Log

- 2026-09-09 — Reproduced HTTP 200 originals / HTTP 500 derivatives with MissingSharp with copied local images. Identified stale service after Vite-only restart, implemented native-transform wrapper, and added restart/original/derivative/animation regression.

- 2026-09-09 — Worker and parent `make check` passed: 44 tests, zero Astro diagnostics/privacy findings. The copied-checkout regression served three byte-identical originals and nine decoded WebP derivatives after a Vite restart, preserving the inline animation’s 19,260 ms loop. Existing preview on port 4321 returned HTTP 200 for all three thumbnails and full-size 1920×1106 originals; gallery end controls passed. All 14 tracked project media files are repository-local regular files.
