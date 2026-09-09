# Slowframe draft evidence

Status: text draft prepared in the parallel Astra batch; final user review pending. Entry: `src/content/projects/slowframe.md`.

## Source and scope

- Source snapshot: `ba9e127f3b7a3ef1df8426a35b57a3cfce6843bd`; product files clean, untracked project metadata excluded. No source changes or live Home Assistant access occurred.
- Evidence: add-on DOCS/CHANGELOG/config, Python browser/capture/scheduler/image-app/imaging/store modules, and web UI.
- Current implementation supports PNG/JPEG/BMP, dithering, theme/query controls, serialized captures, cached serving and pause-when-unwatched. The draft corrects the top-level README's narrower PNG-only description and explains plain HTTP image endpoints versus authenticated Ingress settings.
- Languages: Python, JavaScript, HTML, CSS; tags Home Assistant, Dashboards.
- Candidate milestone span: August 3–4, 2026, from substantive skeleton/capture commits `14e8102`/`92d1c91` to the documented 0.11.0 initial-spec milestone (`9887eef`). The final implementation was authored August 3 Pacific and merged August 4 UTC; the draft follows the changelog's August 4 completion date. Store/device acceptance remains pending, so the user should review this milestone span.
- No public source/release URL or original model attribution was verified; no internal address is included.

## Images needed

Only small project store branding was found and inspected: 250×100 logo and 128×128 icon. They are unsuitable as full-size portfolio covers; neither was copied. Both cover and product screenshots are needed.

Suggested captures: frame list/editor with safe demonstration content, representative color and dithered image outputs, and optionally a low-powered display showing an output. Avoid household details and private URLs. Source branding came from project artwork commit `28cfb8b`; no explicit root license file was found.

## Verification

Astra/high worker committed `4550140`; formatting/whitespace and privacy checks passed. Parent reviewed/integrated the article and reran format/privacy screening (262 snapshots, zero findings). Worktree/branch safely removed. Final batch verification passed; see [the batch review](batch-draft-review.md).
