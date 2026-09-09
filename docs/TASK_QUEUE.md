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
   - Slice 4 — landing page and searchable catalog: accepted by the user on 2026-09-08; implemented and independently verified (43 tests, layout/search/history/browser checks, draft separation), committed as `577e1ed`.
   - Slice 5 — Half-Life: Continuum Edition onboarding: [in-progress], explicitly authorized by the user on 2026-09-08. User approved the rendered design/current article; story, authorship, and June 9 start are confirmed. First-pass media integrated: full-resolution menu-artwork cover and user-selected README GIF inline. Parent checks passed 43 tests, production-animation/timing and desktop/mobile crop review, full-cover viewer, and real draft exclusion. Completion-date/taxonomy review and final assembled-entry review remain pending. `draft: true` remains set.
   - Slice 6 remains pending; stop for user review between slices.
