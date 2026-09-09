# SPEC: FantasyBoy portfolio onboarding

- **Status:** in-progress (intake)
- **Approval record:** On 2026-09-08 the user selected FantasyBoy as the next project, described it as their oldest, and directed discovery under `/mnt/Fast/projects/`. BeamVM is paused awaiting the user's images. Continue the established onboarding workflow; do not reopen the approved site design.

## Summary

Prepare a FantasyBoy entry for whatclaudemade.com using the existing project pages, cards, gallery, and Markdown contracts. Inspect the local source and public project evidence, gather the user's story, review the existing screenshots, and create an accurate draft before final content acceptance.

## Goals

- Describe the fantasy console, compiler, debugger, and sample games accurately.
- Establish public source/download links, source-backed language/date candidates, and the user's actual history and Claude contribution.
- Select a cover and gallery images that show both the games and the development tools.
- Review the article and images locally, then select the entry for public builds only after user acceptance.

## Non-Goals

- Modifying, initializing, rebuilding, or cleaning FantasyBoy's independently active source checkout.
- Resuming BeamVM while its user-prepared images are pending.
- Changing the site's design/schema or deploying the domain.
- Assuming this was the user's first-ever AI project, or importing the other projects' development dates and model attribution.

## Key Decisions

| Decision | Choice | Rationale / alternatives considered |
| --- | --- | --- |
| Queue order | FantasyBoy active; BeamVM paused; launch pending | Explicit user direction. |
| Site contracts | Existing Astro/Markdown project schema and media presentation | The visual design and prior write-ups are approved. |
| Source | Read-only sibling `FantasyBoy` checkout plus verified public sources | The user supplied the location; template setup is occurring independently there. |
| Story | User's oldest-project statement plus project-specific intake | Do not infer motivation or exact model versions from a contribution policy. |
| Media | Review existing Breakout/Keen/Tetris screenshots first | Three 1424×968 images already exist; preserve originals and review crops/captions. |
| Dates and publication | Reviewed project-specific dates; draft until acceptance | Git history and later repository cleanup may not equal development endpoints. |

## Design

Use `src/content/projects/fantasyboy.md` and `src/assets/projects/fantasyboy/` with the existing content contracts. Record evidence and review decisions in `docs/projects/fantasyboy.md`. The initial source describes a Python fantasy console with a custom 6502-style CPU, a 256×200 RGB332 display, a minimal C compiler, debugging tools, and three sample games. Establish what the user wants to emphasize before turning the feature inventory into a first-person story.

The existing screenshots show game output beside registers, memory/buffer views, bytecode disassembly, and sprite inspection. They are candidates for reuse, not automatic publication approval. Preserve meaningful UI content in the enlarged gallery; choose thumbnail composition with the user.

## Implementation Plan

1. **Evidence and story intake — (M), [serial].** Read source/history/public links and existing media; gather the user's motivation and agent workflow.
   - **Worker-owned files:** none; read-only evidence report.
   - **Orchestrator-owned files:** this spec, `docs/projects/fantasyboy.md`, optional `docs/projects/fantasyboy-maintainer-brief.md`, queue/handoff/memory and shared onboarding docs.
   - **Verification:** primary source paths/revisions, anonymous public-link checks, dimensions and visual inspection; no source app build or mutation.
2. **Draft article and media — (M), [serial].** Integrate factual/user-derived copy and selected local assets.
   - **Worker-owned files:** `src/content/projects/fantasyboy.md`, `src/assets/projects/fantasyboy/**`, `src/data/project-taxonomy.ts` (reviewed identifiers only).
   - **Orchestrator-owned files:** evidence/provenance and shared docs above.
   - **Verification:** worker formatting and source/asset checks; parent `make check`, desktop/mobile draft/gallery/crop review, link checks, and draft exclusion.
3. **Content acceptance — (L), [serial].** Apply reviewed metadata/media refinements and the user's final assessment before public-build selection.
   - **Worker-owned files:** the same article/assets/taxonomy files, for reviewed refinements only.
   - **Orchestrator-owned files:** acceptance/provenance, this spec, queue/handoff/memory, and deferred mirroring.
   - **Verification:** parent complete checks and actual public-output review. No deployment is implied.

## Open Questions

No new site architecture decisions are required. Exact story/attribution, dates, public links, and selected images are intake outputs to be reviewed before publication.

## Deferred / Follow-ups

- None yet.

## Change Log

- 2026-09-08 — User paused the approved BeamVM write-up for images and selected FantasyBoy next. Located the source and existing screenshots; started read-only evidence and story intake.
