# Handoff Archive 12 — Website launch

## Current

- **2026-09-10 — Website is live at https://whatclaudemade.com.** Continuum and FantasyBoy are published with September 10 first-publication dates. BeamVM stays paused for its code release; six other entries remain drafts. ROOT launch task is in-review for final user assessment.
- Launch `4840dad` added check/deploy, sitemap/robots and production draft-asset exclusion, including warm-cache withdrawal coverage. CI fix `e2c71d5` excludes fixture dependency symlinks from Git and asserts they stay ignored/unstaged; production privacy rules are unchanged. Worker and parent full checks passed 48 tests with zero Astro/privacy findings. Hosted check/deploy passed for `e2c71d5` and documentation follow-up `caf3c61`.
- All 49 live files matched the reviewed build byte-for-byte; seven draft routes returned 404. Desktop/mobile review confirmed both articles, fonts/images, full-size gallery and animation. Logs and audits live under `.agent-worktrees/_runs/site-launch/`.
- User configured Pages Actions/custom domain and Route 53, then removed/re-added the domain to restart certificate provisioning. Valid Let’s Encrypt TLS now covers apex/www; HTTP and www route to canonical HTTPS. HTTPS articles, sitemap/robots and unpublished BeamVM behavior pass; live browser ends in a secure context with loaded images/fonts and no HTTP subresources. Evidence: `live-https-check.json`. The requested 15-minute timer was canceled because the certificate became ready immediately.
- GitHub handles certificate management; no local ACME client/cron is needed here. User has an older independent ACME/cron setup for another certificate. Domain ownership-verification TXT remains unconfirmed; instructions are in `docs/launch.md`. No authenticated GitHub/AWS admin connector is available, so user handles console settings.
- **Next:** user assessment/next project choice. Preserve BeamVM’s pause. Five batch entries still need images; see `docs/projects/batch-draft-review.md`. User’s `tmp/actions-error-output.txt` remains preserved and ignored via `/tmp/`.
- Worker scratch checkouts are removed; only main remains. No worker is writing. Temporary review browser is closed; the user's normal preview server remains untouched.

