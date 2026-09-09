# Task Queue

Agent-worked, ordered queue that drives session-by-session work. Processing rules live in `AGENTS.md` ("Task queue"). This file is project-owned.

## Setup

- First-run setup completed 2026-09-07. Astro/Markdown/TypeScript scaffold, local commands, and pre-commit checks verified; initial push to the private `github` remote succeeded. `main` tracks `github/main`.

## Queue

1. [in-progress] ROOT_SPEC.md
   - 2026-09-07: user approved the full specification and authorized slice 1. Initial Planning is accepted and removed from the active queue.
   - Slice 1 — content contracts and tooling: accepted by the user; implemented and independently verified in `b1d60c4`.
   - Slice 2 — shared design and typography: accepted after the user reviewed preview images; committed as `9d195cd`.
   - Slice 3 — project page and image gallery: accepted by the user; committed as `215cd57`.
   - Slice 4 — landing page and searchable catalog: implemented and independently verified (43 tests, layout/search/history/browser checks, draft separation); committed as `577e1ed` and awaiting user review.
   - Session wrapped at the user's request on 2026-09-08; no onboarding started during wrap-up. Resume with slice 4 review.
   - Next is slice 5 — Half-Life: Continuum Edition onboarding. Slices 5–6 remain pending; stop for user review between slices.
