# SPEC: Public and private source availability

- **Status:** in-review (implemented and independently verified)
- **Approval record:** On 2026-09-09 the user requested publishable articles about projects whose code is not publicly available, preserving ordinary project requirements except the public code link, and reserved the `public` and `private` tags. They also paused BeamVM until its code release is ready. This directly authorizes the schema, taxonomy, and content migration below.

## Summary

Separate source availability from article publication using two reserved tags. A project with private code can have a published article, cover, gallery, metadata, and updates through the existing site components.

## Goals

- Published entries carry exactly one reserved source-availability tag: `public` or `private`.
- `public` entries require a valid HTTPS repository URL; `private` entries omit that field.
- Private-source articles meet every other existing publication requirement and appear normally in homepage, catalog, search, and detail output.
- Drafts can leave source availability undecided, but cannot claim both tags.
- Preserve BeamVM's accepted content and explicit pause for its forthcoming code release.

## Non-Goals

- Publishing BeamVM, reclassifying unknown existing drafts as private, changing source projects, deploying the website, or adding access controls.
- Relaxing dates, prose, taxonomy, cover, image, or local-media requirements.
- A new update feed or changed recency ordering; the existing optional `updatedOn` field supports ongoing revisions.

## Key Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Availability | Reserved existing-taxonomy IDs `public` / `private`, labels Public / Private | Requested names appear and filter through existing tag UI. |
| Publication | Exactly one availability tag when `draft: false`; zero or one in drafts | Incomplete drafts remain authorable; accepted articles state source availability explicitly. |
| Source link | Required for published `public`; forbidden whenever tagged `private` | A private project has no public source destination; do not put inaccessible source links into its article metadata. |
| Other links | Existing optional release/video fields unchanged | User changes only the source-availability requirement. |
| Existing content | Add `public` to Continuum and FantasyBoy only | Both have accepted, verified public repositories. Other draft classifications remain undecided. |
| Dates | Preserve development endpoints and first publication; use existing `updatedOn` for revisions | More frequent updates require no new schema or scheduling. |

## Design

Extend the taxonomy and schema refinement. Keep `draft` as the sole publication switch and keep existing public-selection helpers named as they are; in these helper names, public means website output, regardless of code availability. Remove the unconditional repository requirement from `PublishedProjectData`. Existing metadata rendering already omits an absent Source link and renders tags/update dates.

Validate both tags as contradictory in drafts and published articles. Require exactly one for published articles, require a repository only for published `public`, and reject repository metadata on `private` articles. Preserve all other validators. Add meaningful coverage for private publication, unchanged required fields, contradictions, source-link behavior, output inclusion, and availability filtering. Keep fixtures synthetic; no real private project is selected for publication by this task.

## Implementation Plan

1. **Availability contract and output verification — (M), [serial].** One native Astra/high worker in the main checkout; no concurrent implementation writers.
   - **Worker-owned:** `src/lib/project-schema.ts`, `src/types/projects.ts`, `src/data/project-taxonomy.ts`, `src/content/projects/half-life-continuum-edition.md` and `fantasyboy.md` (tags only), related `tests/project-{schema,metadata,search,pages,catalog}.test.ts`, and `tests/fixtures/projects/{fixtures,page-fixtures,catalog-fixtures}.ts`.
   - **Orchestrator-owned:** this spec, ROOT_SPEC, project/development guidance, queue, BeamVM pause/evidence, handoff, and memory.
   - **Verification:** worker `make check`; parent independent full check plus browser review of representative private/public synthetic output and real public tags. No committed demo projects.

## Open Questions

None for this implementation. Future projects receive availability classifications during onboarding.

## Deferred / Follow-ups

- Resume BeamVM public-build selection when the user finishes its code release and supplies the public repository URL.

## Change Log

- 2026-09-09 — Created from the user's source-availability requirement and BeamVM pause; reserved mutually exclusive public/private tags while retaining the existing publication contract.

- 2026-09-09 — Worker and parent `make check` passed: 46 tests, zero Astro diagnostics, zero privacy findings (290 snapshots), five production pages. Browser checks of separate synthetic output confirmed private/public homepage cards, availability URL/filter behavior, Updated metadata, private Source omission, public Source retention, full-image gallery, and desktop/mobile layouts. Real content changes add only `public` to Continuum and FantasyBoy; BeamVM stays paused with no content changes.
