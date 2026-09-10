# Handoff Main Index

## Current

- **2026-09-10 — Website is live at https://whatclaudemade.com.** Continuum and FantasyBoy are published with September 10 first-publication dates. BeamVM stays paused for its code release; six other entries remain drafts. ROOT launch task is in-review for final user assessment.
- Launch `4840dad` added check/deploy, sitemap/robots and production draft-asset exclusion, including warm-cache withdrawal coverage. CI fix `e2c71d5` excludes fixture dependency symlinks from Git and asserts they stay ignored/unstaged; production privacy rules are unchanged. Worker and parent full checks passed 48 tests with zero Astro/privacy findings. Hosted check/deploy passed for `e2c71d5` and documentation follow-up `caf3c61`.
- All 49 live files matched the reviewed build byte-for-byte; seven draft routes returned 404. Desktop/mobile review confirmed both articles, fonts/images, full-size gallery and animation. Logs and audits live under `.agent-worktrees/_runs/site-launch/`.
- User configured Pages Actions/custom domain and Route 53, then removed/re-added the domain to restart certificate provisioning. Valid Let’s Encrypt TLS now covers apex/www; HTTP and www route to canonical HTTPS. HTTPS articles, sitemap/robots and unpublished BeamVM behavior pass; live browser ends in a secure context with loaded images/fonts and no HTTP subresources. Evidence: `live-https-check.json`. The requested 15-minute timer was canceled because the certificate became ready immediately.
- GitHub handles certificate management; no local ACME client/cron is needed here. User has an older independent ACME/cron setup for another certificate. Domain ownership-verification TXT remains unconfirmed; instructions are in `docs/launch.md`. No authenticated GitHub/AWS admin connector is available, so user handles console settings.
- **Next:** user assessment/next project choice. Preserve BeamVM’s pause. Five batch entries still need images; see `docs/projects/batch-draft-review.md`. User’s `tmp/actions-error-output.txt` remains preserved and ignored via `/tmp/`.
- Worker scratch checkouts are removed; only main remains. No worker is writing. Temporary review browser is closed; the user's normal preview server remains untouched.

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
