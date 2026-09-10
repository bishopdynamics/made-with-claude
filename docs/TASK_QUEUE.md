# Task Queue

Agent-worked, ordered queue that drives session-by-session work. Processing rules live in `AGENTS.md` ("Task queue"). This file is project-owned.

## Setup

- First-run setup completed 2026-09-07. Astro/Markdown/TypeScript scaffold, local commands, and pre-commit checks verified; initial push to the private `github` remote succeeded. `main` tracks `github/main`.

## Queue

1. [in-review] ROOT_SPEC.md — site launched; final user assessment
   - 2026-09-07: user approved the full specification and authorized slice 1. Initial Planning is accepted and removed from the active queue.
   - Slice 1 — content contracts and tooling: accepted by the user; implemented and independently verified in `b1d60c4`.
   - Slice 2 — shared design and typography: accepted after the user reviewed preview images; committed as `9d195cd`.
   - Slice 3 — project page and image gallery: accepted by the user; committed as `215cd57`.
   - Slice 4 — landing page and searchable catalog: accepted by the user on 2026-09-08; implemented and independently verified (43 tests, layout/search/history/browser checks, draft separation), committed as `577e1ed`.
   - Slice 5 — Half-Life: Continuum Edition onboarding: accepted as portfolio v1 ready for release by the user on 2026-09-08. Approved prose/cover/GIF preserved; source-backed metadata completed and entry selected for public builds. More gallery images are deferred to portfolio v2.
   - Slice 6 — launch workflow and final review: user requested going live today, 2026-09-10. Actions check/deploy succeeded for `e2c71d5`; all 49 deployed files match the reviewed artifact and seven draft routes return 404. Route 53 resolves correctly. After the user re-saved the custom domain, GitHub issued a valid Let’s Encrypt certificate for apex/www; HTTPS pages, sitemap/robots, images/fonts, and HTTP/www redirects were verified. Both accepted articles are live at canonical HTTPS. Current public entries: Continuum and FantasyBoy. BeamVM stays paused.

2. [in-review] FEATURE_SPEC_local_image_serving.md
   - User reported broken Vintage Vault images and reiterated repository-local copies. Copies are present and valid; reproduced stale image-service failure after a Vite restart. Native-transform fix and real image-response regression passed worker and parent `make check` (44 tests). Existing preview thumbnails and all full-size originals load successfully; all 14 tracked project media files are regular files in this repo.

3. [in-review] FEATURE_SPEC_batch_project_drafts.md — six drafts ready
   - User authorized wallflower, vintage, vintage-vault, simpler-camera-card, slowframe, and mezuril drafts using parallel Astra agents, with existing images selected at agent discretion and missing media reported.
   - All six drafts integrated from two Astra/high workers reused in parallel waves; the thread limit prevented a third. Parent checks passed 43 tests plus desktop/mobile draft/card/gallery review and production exclusion. Existing entries remain unchanged; all worktrees/branches cleaned up.
   - Vintage Vault has three selected screenshots. Wallflower, Vintage, Simpler Camera Card, Slowframe, and Mezuril need usable cover/product images. Capture suggestions and metadata gaps are in `docs/projects/batch-draft-review.md`. User assessment/publication remain pending.

4. [paused] FEATURE_SPEC_beamvm_onboarding.md — accepted content; code release in progress
   - 2026-09-09: user accepted BeamVM and FantasyBoy as ready to publish. BeamVM’s approved article, dates, metadata, and six local screenshots are complete. The user subsequently paused BeamVM while preparing its code release. Resume public source-link verification and build selection when they return to it; do not use the new private category to bypass the pause.
   - FantasyBoy is accepted and removed from the queue; its public-build selection passed 44 tests, five-page production validation, and browser checks with `publishedOn: 2026-09-09`.
