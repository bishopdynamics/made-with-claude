# SPEC: BeamVM portfolio onboarding

- **Status:** done
- **Approval record:** On 2026-09-08 the user accepted Continuum portfolio v1 as release-ready, said BeamVM is the next ready project, and explicitly requested moving on to it. This authorizes onboarding using the existing portfolio design and content contracts; it does not approve invented copy or unreviewed assets.

## Summary

Prepare BeamVM as the next portfolio entry before the website launch task. Gather the current project facts, the user's story, representative media, and reviewed development dates, then create and review its article using the existing page, catalog, and gallery components. Continue adding projects individually.

## Goals

- Present BeamVM accurately using implemented behavior and the user's account.
- Identify the canonical public repository/release links and supported platforms.
- Prepare one representative cover plus supporting article/gallery media selected with the user.
- Review motivation, Claude/Codex attribution, development dates, languages, and tags.
- Verify the draft locally and the selected public build before accepting the entry.

## Non-Goals

- Building or changing BeamVM itself, deploying the website, or publishing other projects in bulk.
- Redesigning the approved site or adding new content/schema/UI mechanisms without a concrete need.
- Treating an early README, historical spec, or Git first/last commit as authoritative proof of current behavior or dates.
- Automatically reusing Continuum's authorship, development workflow, media choices, or metadata for BeamVM.

## Key Decisions

| Decision | Choice | Rationale / alternatives considered |
| --- | --- | --- |
| Queue order | BeamVM resumed for supplied screenshots and shared draft metadata; FantasyBoy remains in review | User supplied the images that the pause was waiting for and requested metadata in both drafts. Changes are serialized through one code worker. |
| Design and contracts | Reuse ROOT_SPEC's Astro/Markdown project schema, taxonomy, cards, gallery, and prose | The user approved the site design and article presentation. |
| Starting source | Read-only local `beamvm` checkout plus verified public sources | Local README covers early M0/M1; inspect current source/history to avoid stale claims. |
| Authorship and motivation | Gather BeamVM-specific input from the user | Do not infer a personal story or model attribution from another project. |
| Media | Discuss a representative cover and supporting captures with the user | Existing assets and tooling are evidence to evaluate, not automatically publishable captures. Inline animated assets may use the established local Markdown image path. |
| Dates | Reviewed project-specific start and completion endpoint; keep portfolio publication separate | Public history may start after local work, as it did for Continuum. |
| Publication | Draft until user content review; website deployment remains a separate task | Draft authoring and local review need no push. |

## Design

Use `src/content/projects/beamvm.md` with local images under `src/assets/projects/beamvm/`. Follow the reusable onboarding process and record provenance/review decisions in `docs/projects/beamvm.md`. The title starts as the user's “BeamVM”; resolve any branding difference while reviewing sources. Initial source context describes a Rust programming game with a Python-flavored DSL controlling a simulated vector CRT and a time-travel debugger; confirm its current scope before drafting.

The final story should explain what visitors can do, why the user wanted it, the distinctive results and design choices, and the human/agent roles. Prefer a few concrete examples with truthful images over a list of every internal subsystem. Source availability, release links, exact dates, current features, authorship, and chosen media are intake outputs, not assumptions.

## Implementation Plan

1. **Evidence and intake — (M), [serial].** Inspect current project/source/release/media evidence and discuss story/capture choices with the user.
   - **Worker-owned files:** none; read-only evidence report from the local BeamVM checkout and public sources.
   - **Orchestrator-owned files:** `docs/projects/beamvm.md`, optional `docs/projects/beamvm-maintainer-brief.md`, this spec, queue/handoff/memory, and reusable onboarding notes.
   - **Verification:** cite actual source paths/revisions and public URLs; distinguish observed implementation from historical plans and confirm the user's account.
2. **Article and media draft — (M), [serial].** Integrate factual copy and selected assets using the existing contracts.
   - **Worker-owned files:** `src/content/projects/beamvm.md`, `src/assets/projects/beamvm/**`, `src/data/project-taxonomy.ts` (source-backed draft identifiers), `src/components/ProjectMeta.astro`, `src/components/ProjectCard.astro` (draft-only pending metadata labels), `src/content/projects/fantasyboy.md` (source-backed language/tag fields only, preserving the user's dates and prose).
   - **Orchestrator-owned files:** evidence/provenance and shared documentation above.
   - **Verification:** worker formatting and source-asset verification; parent `make check`, link checks, desktop/mobile article/cover/gallery review, draft exclusion, and animation checks where relevant.
3. **Content acceptance — (L), [serial].** Resolve remaining reviewed metadata/media and obtain the user's assessment, then mark the entry eligible for public builds.
   - **Worker-owned files:** `src/content/projects/beamvm.md`, `src/assets/projects/beamvm/**`, `src/data/project-taxonomy.ts` for accepted refinements only.
   - **Orchestrator-owned files:** this spec, evidence/review record, queue/handoff/memory and `docs/DEFERRED.md` mirroring.
   - **Verification:** parent complete checks and actual public-output review after acceptance. No site deployment is implied.

## Open Questions

BeamVM’s story, dates, and selected media are accepted. The user is preparing its code release and has paused this onboarding task; verify the public repository URL when they return to it.

## Deferred / Follow-ups

- None yet. Record only deliberate follow-ups arising from BeamVM onboarding.

## Change Log

- 2026-09-11 — User approved publication. Pushed `15b066b`; Actions run 34626339425 succeeded. Live: `/projects/beamvm/` is indexable and non-draft with the Source link, six gallery thumbnails, Published Sep 11, 2026, and the visit counter; the sitemap lists it; BeamVM leads the homepage. Task removed from the queue.
- 2026-09-11 — User released the code publicly at https://github.com/bishopdynamics/BeamVM (MIT; README describes Linux/Vulkan and macOS/Metal, the Home and Pro boards, the display-list coprocessor, and the first two shareware DOOM maps, all consistent with the accepted article; no GitHub release yet, so no Download link). Entry selected for public builds with `publishedOn: 2026-09-11`; `make check` and production preview passed. Publication awaits the user's approval.
- 2026-09-09 — User explicitly paused BeamVM while working on its code release. Preserve content acceptance and resume when they return with the public source. The separately requested private-source category does not authorize publishing BeamVM now.

- 2026-09-09 — User accepted the assembled article and six local screenshots as ready to publish. Public repository URL is still missing and required by the existing publication schema; requested the URL without reopening content review.

- 2026-09-08 — Metadata/gallery integration independently verified: 43 tests, zero diagnostics/privacy findings, draft card/detail metadata, pending fallbacks, responsive six-image gallery/full originals, and production/public-search exclusion. Approved prose remains unchanged; final entry review is pending.
- 2026-09-08 — User supplied `docs/SCREENSHOTS.md`, requested metadata in drafts, and confirmed BeamVM dates August 25–September 8 (including planning earlier on August 25). Resumed the media step, selected six source captures, and populated known draft labels/dates. Shared component/FantasyBoy metadata edits are explicitly owned in this serial slice. Approved prose remains unchanged; no publication is implied.
- 2026-09-08 — User approved the write-up and explicitly paused BeamVM onboarding while preparing images. Resume when those images are ready; FantasyBoy is now the active onboarding task. The existing site draft remains unchanged.
- 2026-09-08 — User supplied the BeamVM story: constrained game-making on a vector CRT, repair exercises, launcher/shell growth, and fictional Pro graphics hardware enabling a compromised DOOM-derived game. Draft keeps tested scope limited to the first two shareware maps; full-campaign conversion remains theoretical. Site domain corrected to `whatclaudemade.com`.
- 2026-09-08 — User selected BeamVM as the next ready project and authorized onboarding before website launch. Reused the approved content/design workflow with serial file ownership.
