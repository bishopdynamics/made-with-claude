# Task Queue

Agent-worked, ordered queue that drives session-by-session work. Processing rules live in `AGENTS.md` ("Task queue"). This file is project-owned.

## Setup

- First-run setup completed 2026-09-07. Astro/Markdown/TypeScript scaffold, local commands, and pre-commit checks verified; initial push to the private `github` remote succeeded. `main` tracks `github/main`.

## Queue

1. [in-progress] FEATURE_SPEC_project_video.md — Continuum YouTube player
   - 2026-09-10: user accepted the launched site and selected the TODO feature to test the project-update cycle. Root launch is accepted and removed from the active queue.
   - Approved scope: responsive YouTube player between gallery and story, retained GIF/prose, original publication/development dates preserved, and `updatedOn` for the revision.
   - User requested minimal player presentation: spec now uses supported options for a white progress bar, hidden annotations where supported, and same-channel recommendations, while retaining playback controls. Deprecated branding flags are excluded.
   - Video oEmbed returned HTTP 200 with the expected Continuum title. Actual playback will be verified in the page during implementation. User approved the full refined spec on 2026-09-10 and requested session wrap.
   - 2026-09-10 (later session): implemented by one Codex Astra/high worker via hanuman in the main checkout. Parent `make check` passed (52 tests, 0 privacy findings) and browser review of the production preview passed on desktop and 400px: no autoplay, real playback after click, fullscreen/mute/seek controls, fallback link, GIF/gallery/dates preserved, `updatedOn: 2026-09-10`. Committed locally, **not pushed**. Next: user reviews the rendered update (`make run` or `npm run preview`, then `/projects/half-life-continuum-edition/`); on approval push `main` to `github`, follow Actions, verify the live page, and mark the TODO done.

2. [in-review] FEATURE_SPEC_local_image_serving.md
   - User reported broken Vintage Vault images and reiterated repository-local copies. Copies are present and valid; reproduced stale image-service failure after a Vite restart. Native-transform fix and real image-response regression passed worker and parent `make check` (44 tests). Existing preview thumbnails and all full-size originals load successfully; all 14 tracked project media files are regular files in this repo.

3. [in-review] FEATURE_SPEC_batch_project_drafts.md — six drafts ready
   - User authorized wallflower, vintage, vintage-vault, simpler-camera-card, slowframe, and mezuril drafts using parallel Astra agents, with existing images selected at agent discretion and missing media reported.
   - All six drafts integrated from two Astra/high workers reused in parallel waves; the thread limit prevented a third. Parent checks passed 43 tests plus desktop/mobile draft/card/gallery review and production exclusion. Existing entries remain unchanged; all worktrees/branches cleaned up.
   - Vintage Vault has three selected screenshots. Wallflower, Vintage, Simpler Camera Card, Slowframe, and Mezuril need usable cover/product images. Capture suggestions and metadata gaps are in `docs/projects/batch-draft-review.md`. User assessment/publication remain pending.

4. [paused] FEATURE_SPEC_beamvm_onboarding.md — accepted content; code release in progress
   - 2026-09-09: user accepted BeamVM and FantasyBoy as ready to publish. BeamVM’s approved article, dates, metadata, and six local screenshots are complete. The user subsequently paused BeamVM while preparing its code release. Resume public source-link verification and build selection when they return to it; do not use the new private category to bypass the pause.
   - FantasyBoy is accepted and removed from the queue; its public-build selection passed 44 tests, five-page production validation, and browser checks with `publishedOn: 2026-09-09`.
