# Task Queue

Agent-worked, ordered queue that drives session-by-session work. Processing rules live in `AGENTS.md` ("Task queue"). This file is project-owned.

## Setup

- BeamVM (FEATURE_SPEC_beamvm_onboarding.md) was published 2026-09-11 with its public MIT repository and removed from the queue. The site now has Continuum, FantasyBoy, and BeamVM.
- GoatCounter visit counter (FEATURE_SPEC_visit_counter.md) was published 2026-09-11 UTC and removed from the queue; the user confirms pageviews in their dashboard.
- Continuum YouTube player update (FEATURE_SPEC_project_video.md) was published 2026-09-10 and removed from the queue; the project-update cycle is proven end to end.
- First-run setup completed 2026-09-07. Astro/Markdown/TypeScript scaffold, local commands, and pre-commit checks verified; initial push to the private `github` remote succeeded. `main` tracks `github/main`.

## Queue

1. [in-review] FEATURE_SPEC_local_image_serving.md
   - User reported broken Vintage Vault images and reiterated repository-local copies. Copies are present and valid; reproduced stale image-service failure after a Vite restart. Native-transform fix and real image-response regression passed worker and parent `make check` (44 tests). Existing preview thumbnails and all full-size originals load successfully; all 14 tracked project media files are regular files in this repo.

2. [in-review] FEATURE_SPEC_batch_project_drafts.md — six drafts ready
   - User authorized wallflower, vintage, vintage-vault, simpler-camera-card, slowframe, and mezuril drafts using parallel Astra agents, with existing images selected at agent discretion and missing media reported.
   - All six drafts integrated from two Astra/high workers reused in parallel waves; the thread limit prevented a third. Parent checks passed 43 tests plus desktop/mobile draft/card/gallery review and production exclusion. Existing entries remain unchanged; all worktrees/branches cleaned up.
   - Vintage Vault has three selected screenshots. Wallflower, Vintage, Simpler Camera Card, Slowframe, and Mezuril need usable cover/product images. Capture suggestions and metadata gaps are in `docs/projects/batch-draft-review.md`. User assessment/publication remain pending.
