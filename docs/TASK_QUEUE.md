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
   - Slice 5 — Half-Life: Continuum Edition onboarding: [in-progress], explicitly authorized by the user on 2026-09-08. Article includes confirmed motivation, June 9 start date, pride in contact shadows/seamless transitions, extensive user direction, and Claude's sole research/implementation role using Fable and Opus. Workflow covers feature iterations, engine MCP debugging, input simulation, and gameplay/demo tools. Initial parent verification passed 43 tests, desktop/mobile draft review, and production exclusion. Awaiting completion-date/taxonomy review and cover/gallery assets; `draft: true` remains set.
   - Slice 6 remains pending; stop for user review between slices.
