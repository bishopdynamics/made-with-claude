# Task Queue

Agent-worked, ordered queue that drives session-by-session work. Processing rules live in `AGENTS.md` ("Task queue"). This file is project-owned.

## Setup

- First-run setup completed 2026-09-07. Astro/Markdown/TypeScript scaffold, local commands, and pre-commit checks verified; initial push to the private `github` remote succeeded. `main` tracks `github/main`.

## Queue

1. [in-progress] FEATURE_SPEC_batch_project_drafts.md
   - User authorized wallflower, vintage, vintage-vault, simpler-camera-card, slowframe, and mezuril drafts using parallel Astra agents, with existing images selected at agent discretion and missing media reported.
   - Shared taxonomy/brief contract prepared; isolated workers run in waves of up to three. Existing entries remain unchanged and no publication is authorized.

2. [in-review] FEATURE_SPEC_beamvm_onboarding.md — metadata/media ready
   - User supplied `docs/SCREENSHOTS.md` and its image set, requested languages/development/tags in drafts, and confirmed BeamVM dates August 25–September 8, 2026 (2 calendar weeks).
   - Approved article is preserved. Six source screenshots are integrated with Rockfield as cover; both drafts show source-backed language/tag metadata and development spans. Parent verification passed 43 tests, desktop/mobile card/detail review, full-image gallery checks, and public exclusion. Unknown future draft fields use pending labels. Public source/download URL, specific attribution, and final assembled-entry acceptance remain pending.

3. [in-review] FEATURE_SPEC_fantasyboy_onboarding.md
   - 2026-09-08: user selected FantasyBoy next, describing it as their oldest project and directing source discovery under `/mnt/Fast/projects/`.
   - Source/public-link evidence completed. User confirmed this was their first Claude project, mainly Sonnet with possible Opus uncertain, followed much later by Fable/Astra review/template migration. Article and Keen/Tetris/Breakout gallery are prepared; original dates are roughly February 3–5, 2026, with approximate wording preserved. Python/C and Games/Emulation/Developer tools now appear in previews. Final assembled-content acceptance remains pending; keep `draft: true`.

4. [pending] ROOT_SPEC.md — remaining launch slice, after selected onboarding work
   - 2026-09-07: user approved the full specification and authorized slice 1. Initial Planning is accepted and removed from the active queue.
   - Slice 1 — content contracts and tooling: accepted by the user; implemented and independently verified in `b1d60c4`.
   - Slice 2 — shared design and typography: accepted after the user reviewed preview images; committed as `9d195cd`.
   - Slice 3 — project page and image gallery: accepted by the user; committed as `215cd57`.
   - Slice 4 — landing page and searchable catalog: accepted by the user on 2026-09-08; implemented and independently verified (43 tests, layout/search/history/browser checks, draft separation), committed as `577e1ed`.
   - Slice 5 — Half-Life: Continuum Edition onboarding: accepted as portfolio v1 ready for release by the user on 2026-09-08. Approved prose/cover/GIF preserved; source-backed metadata completed and entry selected for public builds. More gallery images are deferred to portfolio v2.
   - Slice 6 — launch workflow and final review: pending after the selected onboarding work. No website deployment has occurred.
