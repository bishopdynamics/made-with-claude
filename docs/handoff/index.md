# Handoff Main Index

## Current

- **2026-09-09 — Source-availability categories implemented and verified.** User requested articles about projects with private code, preserving normal article/media/metadata requirements and reserving `public` / `private` tags. One serial native Astra/high worker implemented the schema/types/taxonomy and synthetic output regressions; parent independently verified and reviewed the changes. Exactly one tag is required for published entries, zero or one in drafts; `public` requires a repository URL when published and `private` omits it. `draft` remains the publication switch. Existing `updatedOn` supports revisions without changing first-publication recency.
- **BeamVM is explicitly paused** while the user finishes its code release. Its approved prose/metadata/six local screenshots remain accepted. Resume with the user’s public source release; do not use the new private category to publish it now. FantasyBoy and Continuum v1 remain selected for public builds, and receive the `public` tag. Other draft classifications are undecided.
- Worker and parent `make check` passed 46 tests, zero Astro diagnostics/privacy findings (290 snapshots), and five production pages. Synthetic browser output verifies both kinds on the homepage/catalog, Public/Private URL filters, private Source omission, public Source retention, Updated metadata, full-size gallery, and desktop/mobile layout. The normal preview on 4321 shows the new Public tag/filter for both accepted entries and BeamVM remains a draft. Logs: `.agent-worktrees/_runs/source-availability/`.
- **Next:** await the user’s assessment or next project. The six batch drafts still need final review; Wallflower, Vintage, Simpler Camera Card, Slowframe, and Mezuril need images. See `docs/projects/batch-draft-review.md`. Actual website launch remains pending; no source-project changes, push, or deployment are part of this task.
- The Vintage Vault image-serving correction is committed as `04898cd`; FantasyBoy acceptance is `d9d8355`. Image copies are local regular files. Keep the Node-bound transform and Vite-restart regression, and reassess on Astro upgrades. The separate long-running preview content-cache issue remains deferred; fresh content synchronization refreshes port 4321.

- Resource audit: only main worktree remains; the Astra worker is finished. Temporary synthetic checkout, review browser, and both temporary servers were stopped/removed; the user’s normal preview on 4321 remains running. Hanuman unavailable.

## Archives

- [archive_10.md](archive_10.md) — local-image fix and FantasyBoy/BeamVM acceptance checkpoint.
- [archive_9.md](archive_9.md) — six-project parallel draft batch and missing media.
- [archive_8.md](archive_8.md) — BeamVM gallery and shared draft metadata verification.
- [archive_7.md](archive_7.md) — FantasyBoy first draft/gallery and original-date intake.
- [archive_6.md](archive_6.md) — domain correction and BeamVM draft verification before its pause.
- [archive_5.md](archive_5.md) — Continuum first-pass media verification before v1 acceptance.
- [archive_4.md](archive_4.md) — previous session wrap before slice 4 acceptance.
- [archive_3.md](archive_3.md) — completed implementation checkpoint and detailed slice 4 verification.
- [archive_2.md](archive_2.md) — Hephaestion first run and early design discussion.
- [archive_1.md](archive_1.md) — inherited template history; reference only.
