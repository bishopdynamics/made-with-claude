# Handoff Main Index

## Current

- 2026-09-07 — User approved the proposed visual direction and page layouts. Draft `docs/spec/ROOT_SPEC.md` now covers the approved design, content model, search/filter/date rules, six serial implementation slices with owned files, and launch acceptance. Full-spec review is next; Initial Planning remains in progress until the user assesses it complete. No implementation slice has started.
- Approved: near-black/charcoal, warm-gray text, muted amber, Inter plus JetBrains Mono, large landing images, horizontal catalog cards stacking on mobile, manually browsed thumbnail gallery with enlarged images, and dark editor code panels. Homepage title is `What Claude/Codex Made`. A single launch project receives a wide tile, and development duration uses reviewed Git/release dates.
- Newly specified defaults for full-spec review: recent means first portfolio publication date; Year means completion year; literal token search covers title/description/tags/languages and combines with one tag/language/year selector each. The project Markdown body is its blog/story; independent blog posts are deferred.
- First entry: Half-Life: Continuum Edition, supplied as <https://github.com/bishopdynamics/Continuum>. It is complete and publicly released. Existing menu GIF is 640×360 and a gameplay video is linked; media selection, higher-resolution capture, article, accurate languages/tags, and project-specific dates belong to onboarding. See `docs/idea/design-discussion.md` for source research and `docs/project-onboarding.md` for the copy/paste maintainer prompt. No site media has been imported.
- User made `bishopdynamics/made-with-claude` public. The private-repository Pages plan question is resolved. Remote remains `github`; `.bishop/` stays versioned and scanned. Deployment and Route 53 changes have not been made.
- Planning is orchestrator-only; no workers were dispatched. Elefant/dev-tools/browser are available; Hanuman and GitHub CLI were absent. Expressive Code 0.44.2 package metadata permits Astro 7, matching the installed foundation. Foundation and prior verification reference are in `evergreen.md` and `archive_2.md`.
- Verification: `make check` passed formatting, Astro diagnostics (zero errors/warnings/hints), all 15 existing safeguard tests, privacy screening (92 snapshots, zero findings), and the one-page scaffold build. The initial sandbox run could not spawn Git (`EPERM`); rerunning with the required execution permission passed. No source/test changes were needed. These checks validate the existing foundation and planning files, not the unimplemented spec.
- Worktree audit: only the main checkout; no workers or preview servers were started. Planning documents are saved in the local planning commit; no push or deployment is part of this slice.

## Archives

- [archive_2.md](archive_2.md) — Hephaestion first run and early design discussion.
- [archive_1.md](archive_1.md) — inherited template history; reference only.
