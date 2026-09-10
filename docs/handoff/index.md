# Handoff Main Index

## Current

- **2026-09-10 — First website deployment succeeded; HTTPS pending.** User authorized launching whatclaudemade.com today. Continuum and FantasyBoy are live over HTTP with first-publication dates reconciled to September 10. BeamVM remains paused for its code release; six other entries remain drafts.
- Launch commit `4840dad` added the check/deploy workflow, canonical sitemap/robots, and production draft-asset exclusion including warm-cache withdrawal coverage. The first hosted run failed seven safeguard tests. User supplied `tmp/actions-error-output.txt`; `/tmp/` is now ignored and their log is preserved.
- Fix `e2c71d5` corrects fixture dependency-symlink ignore rules and asserts the link stays ignored/unstaged, preserving production privacy policy. Astra reproduced all seven failures in a runner-style source path, then 15/15 passed; parent independently confirmed. Worker and parent full checks passed 48 tests, zero Astro diagnostics/privacy findings across 300 snapshots. [Actions run 34521004112](https://github.com/bishopdynamics/made-with-claude/actions/runs/34521004112) passed check and deploy.
- Live HTTP audit: 49/49 deployed files match the reviewed build byte-for-byte, five HTML files, four sitemap URLs, seven draft routes return 404. Browser review confirms both articles, fonts/images, full-size gallery, animation and mobile layout. Evidence: `.agent-worktrees/_runs/site-launch/ci-fix-*` and `live-http-audit.json`.
- User configured Pages Source=GitHub Actions, custom domain, and Route 53. Local/authoritative/public DNS return the correct four apex A records and www CNAME; www HTTP redirects to apex HTTP. The certificate still does not cover the custom domain. Asked the user what Enforce HTTPS shows; answer pending. Domain ownership-verification TXT was not visible at latest check. GitHub/AWS admin access is unavailable to this session, so user handles console settings; agent can push and monitor public APIs/DNS.
- **Next:** finish certificate provisioning and Enforce HTTPS with the user, then verify apex/www HTTPS and HTTP redirects. If provisioning remains stuck, official GitHub instructions recommend removing/re-saving the same custom domain after DNS is correct. See `docs/launch.md`. Keep ROOT launch task in-progress until final verification/user assessment.
- Worker scratch checkouts are removed; only the main worktree remains. No worker is writing. The user's normal preview server remains untouched.

## Archives

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
