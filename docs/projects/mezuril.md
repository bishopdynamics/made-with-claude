# Mezuril draft evidence

Status: text draft prepared in the parallel Astra batch; final user review pending. Entry: `src/content/projects/mezuril.md`.

## Source and scope

- Source snapshot: `1626daddd9743d99c3219baa269990c3762b22cb`, clean sibling checkout. No app execution, actual usage requests, credentials, Keychain, or source changes occurred.
- Evidence: model/history/poller/alerts/menu, Linux app/gauge, macOS app/icon, and accepted cross-platform preferences spec.
- The draft covers usage windows, selected-window gauges, notifications, display preferences, recent consumption estimates, and stale-data handling. Later optional keepalive behavior is outside this draft's described initial version. It makes no vendor pricing or personal/model-attribution claims.
- Language: Python; tags Desktop, Developer tools.
- Source-backed candidate initial-version dates: September 1–2, 2026. Project identity/idea `5d0dea1` and implementation `4299db9` start the work; August 31 was template-only. Matching macOS preferences/v0.3.0 was explicitly accepted in `FEATURE_SPEC_config_window_macos.md` and recorded by `7b30d0c`. User should review the proposed date range.
- Parent independently checked that history/rate features were implemented September 1 and that the macOS icon implementation draws the described monochrome ring gauge. No public source/release URL was verified.

## Images needed

Only tiny status glyphs and vendor SVG marks were found, not usable product imagery. No assets were copied; both cover and product screenshots are needed.

Suggested captures: Linux panel with an expanded usage menu, macOS menu bar with its menu expanded, and Preferences showing display/notification controls. Use demonstration readings and omit account details or credential paths.

## Verification

Astra/high worker committed `49fb392`; format/whitespace/privacy checks passed. Parent reviewed/integrated the article and reran formatting/privacy (268 snapshots, zero findings). Worktree/branch safely removed; final batch checks passed; see [the batch review](batch-draft-review.md).
