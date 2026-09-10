# Handoff Main Index

## Current

- **2026-09-10 — Continuum YouTube player published and verified live.** The user reviewed the rendered update and approved publication. Pushed `b16843f` to `github/main`; Actions run `34538588773` (Check and deploy) succeeded at 22:41 UTC. Live checks on https://whatclaudemade.com/projects/half-life-continuum-edition/: privacy-enhanced iframe with the eight fixed options, `Updated Sep 10, 2026`, sitemap `lastmod` 2026-09-10 for Continuum, drafts still 404, and real playback from the live origin (video advanced after a click, no player error).
- Subtitles: the user asked whether the embed can force captions off. YouTube's documented parameters (`cc_load_policy`, `cc_lang_pref`) can only force captions on. The user fixed it on the video in YouTube Studio; the live player now reports "No captions are available for this video". No site change was needed.
- Implementation summary (see `archive_13.md` for the pre-implementation wrap): one Codex `gpt-6-astra`/high worker via hanuman in the main checkout produced `src/lib/project-video.ts`, `src/components/ProjectVideo.astro`, layout/style changes, tests, and the Continuum `videoUrl`/`updatedOn` frontmatter. Parent `make check` passed (52 tests, 0 privacy findings) and desktop/400px browser review passed before commit.
- Bookkeeping: TODO item marked done (user prunes); the video task is removed from the queue, so the queue now leads with the local-image-serving and batch-drafts reviews, then paused BeamVM. Spec status is done. Dev guide documents the video helper/component contract.
- **Next:** nothing in flight. Remaining queue items are user-assessment reviews (`FEATURE_SPEC_local_image_serving.md`, `FEATURE_SPEC_batch_project_drafts.md`) and paused BeamVM. Wait for the user's direction; do not resume BeamVM unprompted.
- Worktree/worker audit: only the main worktree exists; hanuman run `project-video-142c7f` is finished with no worktree/branch. No preview server or browser session is left running. Elefant captures were written this session.

## Archives

- [archive_13.md](archive_13.md) — Continuum video spec approval and pre-implementation wrap.
- [archive_12.md](archive_12.md) — live HTTPS launch, CI correction and final verification.
- [archive_11.md](archive_11.md) — source-availability feature and pre-launch checkpoint.
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
