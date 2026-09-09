# Task Queue

Agent-worked, ordered queue that drives session-by-session work. Processing rules live in `AGENTS.md` ("Task queue"). This file is project-owned.

## Setup

- First-run setup completed 2026-09-07. Astro/Markdown/TypeScript scaffold, local commands, and pre-commit checks verified; initial push to the private `github` remote succeeded. `main` tracks `github/main`.

## Queue

1. [in-progress] FEATURE_SPEC_beamvm_onboarding.md
   - 2026-09-08: user selected BeamVM as the next ready project after accepting Continuum v1. Onboarding is authorized before website launch; existing site design/content contracts are retained.
   - Intake: source evidence inspected and user motivation/progression supplied. First incomplete article prepared and verified (43 tests, corrected domain/canonical checks, desktop/mobile draft review), covering constrained game-making, repair challenges, launcher/shell, and Pro hardware/DOOM; tested scope is only the first two shareware maps.
   - Next: review the draft, establish the public source/download URL, agent attribution and dates, then prepare selected media. No BeamVM images or publication metadata are approved yet.

2. [pending] ROOT_SPEC.md — remaining launch slice, after BeamVM onboarding
   - 2026-09-07: user approved the full specification and authorized slice 1. Initial Planning is accepted and removed from the active queue.
   - Slice 1 — content contracts and tooling: accepted by the user; implemented and independently verified in `b1d60c4`.
   - Slice 2 — shared design and typography: accepted after the user reviewed preview images; committed as `9d195cd`.
   - Slice 3 — project page and image gallery: accepted by the user; committed as `215cd57`.
   - Slice 4 — landing page and searchable catalog: accepted by the user on 2026-09-08; implemented and independently verified (43 tests, layout/search/history/browser checks, draft separation), committed as `577e1ed`.
   - Slice 5 — Half-Life: Continuum Edition onboarding: accepted as portfolio v1 ready for release by the user on 2026-09-08. Approved prose/cover/GIF preserved; source-backed metadata completed and entry selected for public builds. More gallery images are deferred to portfolio v2.
   - Slice 6 — launch workflow and final review: pending after BeamVM onboarding, per the user's requested order. No website deployment has occurred.
