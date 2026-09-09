# Wallflower draft evidence

Status: draft prepared in the user-authorized parallel Astra batch; final user review pending. Entry: `src/content/projects/wallflower.md`.

## Source and scope

- Source snapshot: `10d1b98969608246c2b353747260e86bf0f39a60` in the sibling `wallflower` checkout. Pending queue/idea/project-metadata edits were excluded; no source changes were made.
- Evidence: `wallflower-manager/DOCS.md`, manager `main.py`/`ha_bridge.py`, compositor C sources, setup Python service, Rust splash source, updater and Raspberry Pi image scripts.
- The draft covers the Chromium/X11-compositor agent, Home Assistant manager, adoption/MQTT controls, software graphics fallback, provisioning, and updates. It avoids stale rollback/multi-window claims and identifies remaining device-management work without promising universal recovery.
- Languages: C, Python, TypeScript, Rust, Shell, JavaScript. Tags: Home Assistant, Kiosks, Desktop.
- Public source/release URL and dates remain pending. A 2024 fork, 2026 overhaul, and ongoing work do not establish a defensible original development span. No personal/model attribution is invented.

## Images needed

No usable cover or product screenshots were found. README screenshot references point to absent files. The only inspected branding is a 250×100 logo and 128×128 icon, too small for a strong cover; neither was copied.

Suggested captures: Manager overview with safe demo kiosks, an adopted kiosk's detail/configuration view, and optionally provisioning/boot presentation. Keep real device addresses, names, credentials, and household/camera imagery out of the captures.

## Verification

Astra/high worker committed `3edd55f`; formatting/whitespace and privacy checks passed. Parent integrated the commit, reviewed the article, and reran formatting and privacy screening (248 snapshots, zero findings). The isolated worktree and branch were safely removed after integration. Final batch/site and browser checks passed; see [the batch review](batch-draft-review.md).
