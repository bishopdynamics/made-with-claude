# SPEC: Six additional portfolio drafts

- **Status:** in-progress
- **Approval record:** On 2026-09-08 the user requested drafts for wallflower, vintage, vintage-vault, simpler-camera-card, slowframe, and mezuril using parallel agents, explicitly requiring Astra for every agent. Existing-image selection is delegated to agent judgment; missing usable images must be reported. This batch overrides the usual single-project scheduling for these drafts, without authorizing publication.

## Summary

Prepare six accurate, locally reviewable project drafts for whatclaudemade.com using existing source repositories, documentation, and suitable images. Preserve the approved site presentation and the existing Continuum, BeamVM, and FantasyBoy entries. Report media gaps and uncertain metadata for user follow-up.

## Goals

- Create all six Markdown drafts with clear descriptions and substantive source-grounded articles.
- Populate languages/tags and defensible date candidates; leave genuinely unknown dates pending rather than inventing history.
- Reuse suitable project images after inspection, with meaningful alt text/captions and preserved originals.
- Identify projects needing usable cover images and those with branding but no product screenshots.
- Use isolated parallel Astra workers, integrate their commits, and verify the final local drafts and publication exclusion.

## Non-Goals

- Source-repository changes, app builds/deploys, installations, live devices, real credentials, or actual account/camera access.
- Publishing entries, pushing the site, or changing domain/DNS configuration.
- Invented personal motivation, model attribution, benchmark results, compatibility, dates, or generated screenshots.
- Reworking previously accepted prose or the shared site design.

## Key Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Models | Native Codex `gpt-6-astra`, high reasoning, for every worker | Explicit user request; Hanuman is unavailable. |
| Concurrency | Three workers at a time across six independent slices | Available concurrency includes the orchestrator; keep write workers isolated. |
| Isolation | Dedicated `.agent-worktrees/draft-<slug>` worktree and branch per project | Workers own disjoint draft/assets and cannot edit shared taxonomy or continuity. |
| Contracts | Existing schema/components plus a serial taxonomy update | Freeze shared identifiers before dispatch; later missing IDs are resolved by orchestrator, not concurrent edits. |
| Writing | Product-led drafts grounded in implementation and source rationale | Batch request does not provide personal stories; do not invent first-person experiences. |
| Media | Existing project-specific artwork/screenshots only, chosen after inspection | No synthetic replacement for absent assets; imagery revealing private homes, camera subjects, or account details is omitted. |
| Uncertainty | Pending fields plus explicit gaps in the evidence report | An import commit or current template migration is not a proven development period. |

## Design

Drafts use `src/content/projects/<slug>.md` and assets use `src/assets/projects/<slug>/`. Keep `draft: true`; omit `publishedOn`. Public source/release URLs must be anonymously verified; internal/login-gated addresses are not copied into public-facing content. Use existing language/tag IDs from the frozen registry. Shared pending labels handle unavailable draft fields.

Articles should explain what the software does, the problem it addresses, distinctive behavior and design choices, and how to obtain it when a public source is available. Distinguish implemented scope from historical proposals and planned features. Keep claims bounded: no universal reliability/compatibility or unmeasured speedups. Inspect source-specific instructions but do not run another repository's startup/task queue or alter it.

Only safe, representative media belongs in the draft. Use original project artwork as a cover when suitable, but record that product screenshots are still missing. Badges, generic vendor logos, generated test graphics, and private surveillance/account images are not substitutes for product media.

## Implementation Plan

1. **Shared taxonomy and dispatch contract — (S), [serial].** Add needed identifiers, prepare self-contained briefs, and commit the base before creating worktrees.
   - **Orchestrator-owned:** taxonomy list (trivial metadata), this spec, queue and worker briefs.
   - **Verification:** formatting, diff review, pre-commit screening.
2. **Per-project drafts — (M), [parallel-1].** All six slices share one dependency group; scheduling uses up to three concurrent isolated workers.

| Slice | Source checkout | Worker-owned files |
| --- | --- | --- |
| wallflower | sibling `wallflower` | `src/content/projects/wallflower.md`, `src/assets/projects/wallflower/**` |
| vintage | sibling `vintage` | `src/content/projects/vintage.md`, `src/assets/projects/vintage/**` |
| vintage-vault | sibling `vintage-vault` | `src/content/projects/vintage-vault.md`, `src/assets/projects/vintage-vault/**` |
| simpler-camera-card | sibling `simpler-camera-card` | `src/content/projects/simpler-camera-card.md`, `src/assets/projects/simpler-camera-card/**` |
| slowframe | sibling `slowframe` | `src/content/projects/slowframe.md`, `src/assets/projects/slowframe/**` |
| mezuril | sibling `mezuril` | `src/content/projects/mezuril.md`, `src/assets/projects/mezuril/**` |

   - **Worker verification:** owned-file format/whitespace checks, privacy scan, image integrity/provenance, and clean owned-file commit. No app/website servers or shared Astro builds from workers.
   - **Orchestrator-owned:** `docs/projects/<slug>.md` evidence and media-gap records, shared docs, queue/handoff/memory, all integration and review.
3. **Integration and review — (M), [serial].** Merge worker commits, rerun their checks and review each diff, run final `make check`, inspect all six local drafts and representative gallery/crop cases, and confirm production exclusion.
   - **Orchestrator-owned:** integration, evidence/media report, shared continuity; corrections return to the responsible Astra worker when substantive.
   - **Verification:** complete site checks, local browser review, missing-media summary, and safe worktree cleanup.

## Open Questions

No additional design approval is needed for the requested drafts. Media gaps, ambiguous dates, and personal attribution are findings to report; they do not block preparation of incomplete drafts.

## Deferred / Follow-ups

- User-provided images and final personal/date/publication review follow the completed draft batch; record the exact missing media in each project note.

## Change Log

- 2026-09-08 — User authorized all six drafts, parallel Astra workers, discretionary existing-image selection, and a missing-image report. Prepared serial taxonomy and isolated worker contracts.
