# Handoff Main Index

## Current

- 2026-09-07 — The user approved the full root spec and starting slice 1. Initial Planning is accepted. Slice 1 (content contracts and tooling) is implemented, independently verified, and saved in the local slice commit after planning commit `cb1f545`. Await the user's slice review before starting slice 2 (shared design and typography). ROOT_SPEC remains in progress; no publication is underway.
- Delivered: strict project content/publication schema; route-independent loader and local-image checks; canonical public and explicit dev-only queries; UTC dates/durations; public search metadata, literal token matching, combined filters and URL state; dark editor code blocks with source-preserving Copy; HTML-parser output checks and isolated fixture builds. Actual project pages, catalog UI, fonts, and content belong to later slices.
- Parent final `make check` passed: zero Astro errors/warnings/hints (22 files), all 38 tests, privacy 109 snapshots/zero findings, one-page static build, and built-output checks. The original 15 safeguards remain. Parent extra probes passed date/timezone boundaries, literal Unicode/punctuation queries, combined filtering, URL roundtrips, draft exclusion, and stable sorting.
- Parent live review in a temporary fixture site passed empty startup, newly created and edited drafts, publication/image resolution, changed image dimensions, invalid-edit clearing/recovery, deletion, and closed port after shutdown. It exposed and resolved inherited NODE_ENV behavior and a watcher path-separator bug. Wrapper tests now cover inherited environment values; production builds still reject draft queries. No source fixtures were published.
- Medium choices are recorded in `docs/development.md`: public-API custom loader to revalidate every sync; directly pinned Expressive Code 0.44.2/line-number plugin, Shiki 4.4.3, parse5 8.0.1, Node 22 types; explicit dev/build runtime modes; actual HTML parsing to distinguish code examples from links. API contracts for subsequent slices are documented there.
- First project remains Half-Life: Continuum Edition at <https://github.com/bishopdynamics/Continuum>. Media/copy/languages/tags/development dates still need onboarding review. Source research is in `docs/idea/design-discussion.md`; the reusable maintainer prompt is in `docs/project-onboarding.md`. No real project entry or media has been imported.
- Worker audit: native Codex gpt-6-astra/high `root_slice_1` finished its serial implementation in the main checkout; no worker worktree was created. Hanuman remains unavailable. Only the main worktree remains, all temporary fixture sites and servers were cleaned up, and no preview is running. Ignored brief/review logs are under `.agent-worktrees/_runs/root-slice-1/`. No push, deployment, or DNS changes were made.

## Archives

- [archive_2.md](archive_2.md) — Hephaestion first run and early design discussion.
- [archive_1.md](archive_1.md) — inherited template history; reference only.
