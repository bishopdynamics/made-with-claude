# Six-project draft review

Prepared at the user's request with two parallel **Astra/high** workers, reused across six isolated worktrees because the session thread limit prevented a third worker. Every entry remains a draft; no publication, source-project changes, or live-device/account access occurred.

## Drafts and images

| Project | Draft | Selected media | Needed from the user |
| --- | --- | --- | --- |
| Wallflower | [Article](../../src/content/projects/wallflower.md) | None; only undersized branding found | Manager overview and adopted-kiosk detail with safe demo content. |
| Vintage | [Article](../../src/content/projects/vintage.md) | None found | GTK Launchers and Wine Settings views; optionally a launched application. |
| Vintage Vault | [Article](../../src/content/projects/vintage-vault.md) | Library cover, Create, Tasks screenshots | No immediate image gap; current full-screen Steam Deck view is optional. |
| Simpler Camera Card | [Article](../../src/content/projects/simpler-camera-card.md) | None found | Safe demonstration card, reconnect state, optional editor/tap-to-live view. |
| Slowframe | [Article](../../src/content/projects/slowframe.md) | None; only undersized branding found | Frame editor/list and color/dithered output examples. |
| Mezuril | [Article](../../src/content/projects/mezuril.md) | None; status/vendor glyphs only | Linux and macOS indicators/expanded menus, plus Preferences with demo data. |

The Vintage Vault originals are retained unchanged. A Storage screenshot was deliberately omitted because it exposed local paths. Small branding and vendor marks were not enlarged or substituted for missing product media.

## Metadata and review points

All six have source-backed languages/tags. Wallflower, Vintage, and Vintage Vault leave dates pending because source history does not establish a matching original completion range. Simpler Camera Card uses an August 15–28 implementation milestone; Slowframe uses the documented August 3–4 milestone; Mezuril uses the accepted September 1–2 initial cross-platform version. These date candidates need the user's review.

Only Simpler Camera Card had a verified public repository URL. Other public source/download destinations remain pending rather than exposing internal remotes. The articles use product-led source-grounded prose; personal stories and precise original model attribution were not invented.

Per-project evidence and requested captures are in the six adjacent project notes. Existing Continuum, BeamVM, and FantasyBoy content is preserved.

## Verification

Each worker passed owned-file formatting/whitespace and full privacy checks before committing. Parent independently reviewed every article, visually inspected all selected images (the JPEGs have no EXIF tags), and reran formatting/privacy after each integration.

Final `make check`: **43 tests passed, zero Astro errors/warnings, zero privacy findings across 271 snapshots, and four public pages built**. All six new drafts plus the existing BeamVM/FantasyBoy drafts remain excluded from public routes/links/search data; Continuum remains the sole public-build-selected entry.

Browser review at 1440px and 375px confirmed all six detail pages, metadata, noindex/draft state, corrected canonical URLs, and no horizontal overflow. The catalog lists all eight drafts with the expected five missing-cover placeholders; its public records still contain only Continuum. Vintage Vault's original 1920×1106 images load in the viewer with contain fitting and correct final-image navigation state.

Logs/screenshots are in ignored `.agent-worktrees/_runs/batch-project-drafts/`. The normal preview on port 4321 serves all six new routes. Temporary review browser/server and all six worktrees/branches were cleaned up; the pre-existing 4321 preview remains running. Nothing was pushed or deployed.
