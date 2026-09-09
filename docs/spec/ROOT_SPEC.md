# SPEC: madewithclaude.com portfolio launch

- **Status:** in-progress
- **Addenda:** none
- **Approval record:** The user approved the foundation, visual direction, and full specification on 2026-09-07. Slices 1–4 are accepted; the user accepted slice 4 and authorized slice 5 on 2026-09-08. Slice 5 onboarding is in progress; slice 6 remains pending.

## Summary

Build a polished, static portfolio at `madewithclaude.com` showing software made by Claude and/or Codex under the guidance of BishopDynamics. A visual homepage introduces recent projects, a searchable catalog helps visitors find relevant work, and each project has an image gallery above its long-form story. Launch with Half-Life: Continuum Edition, preparing its content and media collaboratively. Retain fast local iteration, the existing pre-commit safeguards, and GitHub-only public hosting.

## Goals

- Deliver the landing page, searchable project index, individual project pages, and a useful 404 page.
- Apply the approved black, warm-gray, and muted-amber design with self-hosted free fonts.
- Require every published project to have a representative image, useful description, language/tag metadata, reviewed development dates, and a substantive article.
- Make galleries, search, filters, and code blocks usable on desktop, mobile, and with a keyboard.
- Prepare and review Half-Life: Continuum Edition as the first published entry; add later projects individually with the user.
- Preview locally without a commit or push. Publish the reviewed build through GitHub Actions after a push to `main`, once launch is authorized.
- Preserve existing privacy checks, versioned `.bishop/`, and the approved Astro/TypeScript/Markdown/npm foundation.

## Non-Goals

- A CMS, database, account system, comments, analytics, or hosted search service.
- A separate blog index or independent blog-post collection in this sprint. Each project's Markdown body is its project explanation/blog entry.
- Automatic import or publication of all repositories, media, language totals, or inferred dates.
- Building or changing Continuum itself within this repository.
- Publishing the remaining candidate projects in bulk or adding placeholder projects to fill the homepage.
- A light theme, theme switcher, autoplaying galleries, or an interactive code execution environment.

## Key Decisions

| Decision             | Choice                                                                                            | Rationale / alternatives considered                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation           | Static Astro, TypeScript site code, Markdown content, npm lockfile                                | Already approved and scaffolded. No framework migration or backend is needed.                                                                                                                                                       |
| Identity             | Homepage title `What Claude/Codex Made`; attribution to BishopDynamics                            | User-specified title and broader Claude/Codex scope. Domain remains `madewithclaude.com`.                                                                                                                                           |
| Visual system        | Black/charcoal surfaces, warm-gray text, muted amber, thin borders, generous spacing              | Approved during the design discussion; project imagery carries most of the color.                                                                                                                                                   |
| Typography           | Inter for interface and prose; JetBrains Mono for code; self-host WOFF2 with licenses             | Free font families approved by the user. Avoid runtime font-provider requests.                                                                                                                                                      |
| Content unit         | One Markdown project entry supplies its card, gallery, and article                                | Keeps the showcase and explanation in sync. Independent blog content is a follow-up.                                                                                                                                                |
| First entry          | Half-Life: Continuum Edition; source `bishopdynamics/Continuum`                                   | User selected it as complete, publicly released, and already possessing media.                                                                                                                                                      |
| Required image       | A published entry has at least one gallery image and an explicit cover pointing to that image set | No image-less published cards. Thumbnail crops and enlarged originals serve different needs.                                                                                                                                        |
| Homepage recency     | Date first published on this portfolio, descending; slug breaks ties                              | A newly added project should appear even if the software was released earlier. Routine edits do not reorder it.                                                                                                                     |
| Initial homepage     | One project spans the available width; two or more use the two-column grid, capped at four        | Approved single-project treatment supports a deliberate launch while projects are added individually.                                                                                                                               |
| Index layout         | Horizontal cards on desktop; stacked cards on mobile                                              | Gives descriptions and metadata room without shrinking thumbnails.                                                                                                                                                                  |
| Search               | Local, case-insensitive token matching against title, description, tags, and languages            | Sufficient for the initial catalog; no external index or search server. Full article search is deferred.                                                                                                                            |
| Filters              | Tag, language, completion year; one selection per filter                                          | Small, predictable interface. All active filters combine with the text query.                                                                                                                                                       |
| Development duration | Reviewed start/completion dates, informed by Git history and release evidence                     | An umbrella repo, inherited history, or later maintenance can make raw first/last commits misleading. This is calendar span, not labor hours.                                                                                       |
| Gallery              | Manual thumbnail carousel with a full-image dialog                                                | Preserves the user's requested page order; keyboard, touch, and reduced-motion support are required.                                                                                                                                |
| Code blocks          | Expressive Code with a dark theme, editor frames, Copy controls, optional line numbers            | Existing integration covers the requested presentation. Public package metadata for `astro-expressive-code` 0.44.2 explicitly permits Astro 7; pin it and matching line-number plugin 0.44.2 in the lockfile during implementation. |
| Deployment           | Build/check on GitHub Actions; deploy only `dist/` from successful `main` pushes                  | Source is public, so the private-repository Pages plan requirement is resolved. Domain/DNS activation is a launch step.                                                                                                             |
| Scheduling           | Serial implementation slices with a contract-first start                                          | This is a small, tightly connected site. Shared styles, content, and config make serial work simpler than several isolated checkouts.                                                                                               |

## Design

### Routes and navigation

| Route               | Purpose                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| `/`                 | Title, introduction, up to four recent project tiles, large All Projects link |
| `/projects/`        | Searchable/filterable project catalog                                         |
| `/projects/<slug>/` | Project title, description/metadata, thumbnail carousel, article              |
| `/404.html`         | Brief missing-page message with Home and All Projects links                   |

Use a restrained shared header with a home link and Projects link, plus a minimal BishopDynamics footer. The homepage's primary heading is exactly `What Claude/Codex Made`. The introductory copy is `Projects made by Claude and/or Codex, under the guidance of BishopDynamics.` Use a single H1 per page and ordinary anchors for navigation. The published site has no internal planning, agent, or implementation guidance in its visitor interface.

### Visual system

| Token      | Value     | Use                                        |
| ---------- | --------- | ------------------------------------------ |
| Background | `#080808` | Page canvas                                |
| Surface    | `#141414` | Cards, controls, code panels               |
| Heading    | `#E5E3DE` | Headings and prominent labels              |
| Text       | `#D2D0CB` | Body text                                  |
| Muted text | `#A09F9A` | Secondary metadata                         |
| Accent     | `#D4A15A` | Links, selected controls, focus indicators |

Define these as CSS custom properties in one shared stylesheet. Use subtle neutral borders, approximately 8px corner rounding, and a consistent spacing scale. Start with a centered maximum content width around 1120px and a reading column around 68 characters. Headings and images align left within that container. Use approximately 18px body text with comfortable line spacing; scale the homepage heading fluidly between about 36px and 64px. Code can use 14–15px text with clear line spacing.

On narrow screens use one column and about 20px side padding. At roughly 720px there is room for the two-column landing grid and horizontal index cards. These are starting layout values, adjustable after browser review without changing the approved direction. Verify readable contrast for text, links, code tokens, and focus states. Focus borders must remain clear against their actual adjacent surfaces.

Self-host only the font files/weights used, retain each license, and use `font-display: swap`. Provide system sans-serif and monospace fallbacks. Font and layout loading must not cause excessive page movement.

### Content contracts

Use an Astro build-time `projects` collection under `src/content/projects/*.md` with schema validation in `src/content.config.ts`. Shared TypeScript types and pure metadata/search helpers are established in slice 1. A project's basename is its canonical lowercase kebab-case slug; reject duplicate or malformed slugs.

| Field                      | Type / rule                                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                    | Nonempty text; exact first title is `Half-Life: Continuum Edition`                                                                            |
| `description`              | Short plain-text summary; aim for one or two sentences                                                                                        |
| `draft`                    | Boolean, default `true`; publication is an explicit content change                                                                            |
| `publishedOn`              | Valid `YYYY-MM-DD`, required for publication; first portfolio publication date                                                                |
| `updatedOn`                | Optional valid date; never changes homepage recency                                                                                           |
| `startedOn`, `completedOn` | Valid dates, required for publication; completion cannot precede start                                                                        |
| `languages`                | Nonempty unique list of language identifiers for a published entry                                                                            |
| `tags`                     | Nonempty unique list of tag identifiers for a published entry                                                                                 |
| `repositoryUrl`            | Required HTTPS source-repository URL for publication                                                                                          |
| `releaseUrl`               | Optional HTTPS release/download-page URL                                                                                                      |
| `videoUrl`                 | Optional HTTPS video link, displayed as an external link in this sprint                                                                       |
| `images`                   | Ordered list of `{ id, src, alt, caption? }`; unique IDs, local resolvable images, meaningful alt text; at least one required for publication |
| `coverId`                  | Image ID in `images`, required for publication                                                                                                |
| `coverPosition`            | Optional `{ x, y }`, each 0–100; defaults to center for thumbnail cropping                                                                    |
| Markdown body              | Long-form project explanation; must be nonempty for publication                                                                               |

Keep canonical tag/language identifiers and display labels in `src/data/project-taxonomy.ts`. Start with only those actually needed by reviewed content. Example tag vocabulary includes `games`, `graphics`, `desktop`, and `developer-tools`; these are examples, not assigned metadata for Continuum. New identifiers are a small authoring change. Validate unknown identifiers and duplicates. Do not infer a project's languages solely from an umbrella repository's GitHub language bar.

Schema validation allows an incomplete draft, but published entries missing any required material fail the build with a useful filename/field error. Validate real calendar dates rather than only their string shape. A shared query helper provides one canonical public list to all production routes and metadata outputs. Draft project routes and cards are available through `make run` for author review, clearly marked as drafts locally. They are absent from production routes, search data, sitemap, and metadata. Draft authoring is not a confidentiality mechanism for files committed to the public source repository.

Assets intended for the site belong in `src/assets/projects/<slug>/`. Use the content image helpers and Astro's image processing so local paths, dimensions, and responsive derivatives are available at build time. Only referenced approved images belong in published project content. Do not put raw capture collections into `public/`; that directory is copied as-is.

### Dates and development span

During onboarding, inspect project-specific history across the relevant repositories and identify evidence for the beginning of this project's work and its completion/release endpoint. Record the chosen dates and source commit/release links in the project's onboarding notes. Confirm ambiguous endpoints with the user. Subsequent maintenance does not silently move `completedOn`; later substantial work can be described in an article update.

Calculate the calendar difference between the dates in UTC, independent of the viewer's timezone or daylight-saving changes. Display `Development: Same day` for zero elapsed days, `Development: N days` below 14 days, and exact weeks plus any remaining days thereafter. On the project page show the actual date range as well. Do not label this as hours worked. The year filter uses `completedOn`'s year; publication and update dates remain separate metadata.

### Landing page

- Sort the canonical public list by `publishedOn` descending, then slug ascending, and show its first four entries.
- Render 16:9 image tiles with titles along the bottom, protected by a dark gradient. The whole tile is an anchor with an accessible project name. Use the selected cover crop; titles may wrap without clipping.
- One project gets one wide tile. Two or three occupy the natural two-column grid without fabricated entries; four form the full 2×2. On phones, all tiles stack.
- A temporary zero-project state during development is readable and has no broken cards; the public launch requires the reviewed Continuum entry.
- Place a prominent `All Projects` link after the tiles.

### Catalog, search, and filters

The initial HTML contains all public project cards and usable project links. A small TypeScript module enhances this with search/filter controls; no client framework is required. Hide unavailable filtering controls until JavaScript initializes, so a script failure still leaves a usable catalog.

Each card has one consistent landscape thumbnail on the left, title, description, language labels, development span, and subdued tags on the right. Stack the same content on mobile. Use one primary project link covering the card without nesting interactive filter controls inside it.

Search normalizes case, repeated whitespace, and diacritics. Split a nonempty query into whitespace-delimited tokens; every token must occur somewhere in the combined title, description, tag labels, or language labels. This is literal substring matching, not a regular expression, fuzzy search, or article-body search. Empty search matches all projects. Keep the default publication-date order after filtering.

Provide one Tag, Language, and Year selector, each with an All option. All active selectors and the text query combine with AND. Derive filter choices from the canonical public entries, sorted by label, with years descending. Keep choices stable as results change. Display a result count and a Clear control. A zero-results message offers clearing the filters without removing the controls.

Persist state using `/projects/?q=...&tag=...&language=...&year=...`. Validate values against known options; ignore invalid values. Initialize from the URL, update it with `history.replaceState` while editing, and restore results on history navigation. Debounce only announcement/URL updates if needed; do not steal keyboard focus while results change. Announce the settled result count with a polite live region. Insert search text using safe DOM text APIs.

### Project page and media

Render title and description first, followed by concise languages/development metadata and source/release links. The gallery follows, then the long-form Markdown article. Provide a Back to Projects link. Preserve the authored image order.

The gallery is a horizontal thumbnail strip with manual previous/next scroll controls and touch scrolling. With one image, omit redundant navigation. A thumbnail is initially a link to its image, then enhanced to open a native modal dialog. Keep native image navigation usable if scripts are unavailable.

The dialog shows the whole selected image with `object-fit: contain`, a caption when supplied, its position in the gallery, and named Close/Previous/Next controls. Arrow keys navigate; Escape closes; opening moves focus into the dialog; closing restores focus to the originating thumbnail. Disable previous/next at the ends and for a single image. Prevent background scrolling while open and restore it correctly. Opening, closing, and carousel scrolling respect reduced-motion preferences. Navigation never advances automatically.

Use responsive thumbnail sizes and explicit dimensions. Eagerly load the first visible representative image where appropriate; lazy-load lower-page images, and load large dialog images on demand. Enlarging does not crop away the screenshot content. Check actual readability at the selected display size; a small thumbnail is not automatically sufficient for the expanded view. The first gallery uses reviewed still images. The user approved using Continuum's README GIF inline in the article on 2026-09-08; preserve its animation and aspect ratio, store it locally, and verify the rendered output. A gameplay video is initially an external link.

### Markdown and code

Use ordinary Markdown for articles, with readable headings, lists, links, blockquotes, tables, and inline code. Wide tables and fenced code scroll inside their own containers rather than widening the page. Preserve Markdown code as selectable text.

Configure `astro-expressive-code` with a single dark theme (start with `github-dark`), neutral surface overrides matching the site, and JetBrains Mono. Use a slim editor frame on fenced blocks, displaying an explicit filename/title where supplied and a language label otherwise. Provide a Plain text fallback for blocks without a recognized language. Syntax colors may vary by token while remaining legible in the dark palette. Add the matching optional line-number plugin and allow per-block line-number opt-in.

Code rendering occurs at build time; only Copy behavior requires a browser script. Preserve indentation and literal characters when rendering and copying. Use explicit title metadata rather than removing filename comments from the source. Long lines scroll horizontally by default. Copy success/failure is accessible, and failure leaves text selectable. Avoid injecting article-supplied code as HTML.

### First project and onboarding

Use `https://github.com/bishopdynamics/Continuum` as the authoritative starting source. Initial research found its menu-tour GIF and linked gameplay video, and release `v1.0.0.0` published on 2026-06-22. The GIF is 640×360; an inspected internal chapter thumbnail is 512×288 and contains a diagnostic overlay. Media selection and any higher-resolution capture are part of onboarding, not settled by their presence in the repository. Research details are in `docs/idea/design-discussion.md`.

Write the article with the user around the motivation, finished result, major implementation decisions, how Claude/Codex contributed, representative technical examples, and links for trying the project. Describe Continuum's own changes accurately, distinguish upstream engine/game work, and do not invent model attribution, durations, performance measurements, languages, or screenshots. The existing release date is evidence for review, not an automatically approved development endpoint.

`docs/project-onboarding.md` provides the reusable maintainer prompt and intake process. Keep publication blocked for an incomplete entry while independent site slices proceed. Before converting the entry from draft to published, review its final copy, representative image, gallery, metadata, and dates with the user. This review is already part of the project's requirement to add entries collaboratively.

### Local verification and publication

Retain the existing command vocabulary: `make setup`, `make run`, `make build`, `npm run preview`, `make test`, and `make check`. Extend the existing test command to include focused pure-TypeScript tests using Node 22's type-stripping support while preserving all safeguard tests. Keep TypeScript test syntax compatible with that runtime; use explicit local imports. Include all new source and workflow files in the format checker. Add a built-output check after the static build for routes, draft exclusion, required media, and internal links. Enable each route's output assertions when its implementation slice lands so intermediate commits remain verifiable.

The production preview serves the actual `dist/` artifact. Use it for final browser review; development-only draft pages are not proof of production publication. The site build does not fetch repository content, fonts, or external APIs at request time. Font/media downloads happen during implementation/onboarding and are versioned locally.

Keep one GitHub workflow as the source of truth: extend the existing `.github/workflows/check.yml` with a conditional deploy job rather than creating competing deployments. Pull requests run checks only. A `main` push runs `npm ci` and the complete check/build sequence, uploads only the resulting `dist/` Pages artifact, and deploys it after success. Give write/OIDC permissions only to the deployment job; keep the check job read-only and retain `persist-credentials: false`. Pin supported action releases during the launch slice and use the repo's `.nvmrc` rather than an action's unrelated default Node version. Use a Pages concurrency group to prevent overlapping deployments.

Configure GitHub Pages to use Actions, set canonical domain `madewithclaude.com`, verify domain ownership, then prepare the required Route 53 records and HTTPS setting using current GitHub instructions. Since this is a custom apex domain, do not add a repository-name base path. Use a canonical URL and social metadata on public pages, a sitemap containing only public routes, a robots file, and a simple site favicon. Do not enable publication or change DNS during earlier implementation slices. At launch, present the reviewed artifact and exact settings/records before carrying out externally visible changes; a push to the publishing branch remains publication.

### Acceptance and verification

- `make check` passes existing safeguard tests plus focused tests for published-image requirements, invalid/ordered dates, exact development spans, sorting, combined filters, URL normalization, and draft exclusion.
- Built output includes `/`, `/projects/`, the reviewed public project routes, and 404, with valid internal links and required images. It excludes draft routes and draft records in search/sitemap/metadata. Test with synthetic published/draft fixtures outside production content; never publish test projects.
- Code examples containing TypeScript/C++/shell/plain text, indentation, `<`, `>`, and `&` render correctly. Browser verification confirms Copy returns source text and long lines scroll without overflowing the page.
- Browser review covers 375px, 768px, and 1440px widths, long titles/descriptions, 200% zoom, one/four-project layouts using non-published test fixtures, and zero search results.
- Orchestrator checks keyboard-only search, filter labels, visible focus, gallery navigation, dialog focus/close behavior, reduced motion, and usable static navigation with JavaScript disabled. Singleton browser checks never fan out to workers.
- Inspect the production network for broken requests and unintended runtime font/API/embed requests; inspect layout movement and image sharpness.
- Half-Life copy/media/dates receive the user's review. A successful build alone does not approve the content or constitute task completion.
- During authorized launch, verify the actual Actions result, public page, HTTPS, domain routing, social metadata, and project links. Record any remaining external step rather than claiming an unobserved deployment.

## Implementation Plan

All slices are **[serial]**. Each gets a self-contained worker brief from `TASK_BRIEF_TEMPLATE.md`, an implementation commit, parent verification, and diff review. A lone serial worker can use the main checkout; otherwise use an isolated worktree. Follow the worker model/platform rules in `AGENTS.md`; Hanuman was absent during planning, so recheck availability at dispatch. The orchestrator owns all task-queue, handoff, memory, deferred, and shared documentation updates. Owned-files lists below distinguish that work from worker code ownership.

1. **Content contracts and tooling — (M), [serial].** Establish collection schema, taxonomy, normalized project metadata, public/draft selection, date formatting, search/filter contracts, and unit-test fixtures. Install/pin the code renderer, supply framed-code metadata defaults, and wire tests/checks without changing the page design.
   - **Worker-owned files:** `src/content.config.ts`, `src/types/projects.ts`, `src/data/project-taxonomy.ts`, `src/lib/project-schema.ts`, `src/lib/project-metadata.ts`, `src/lib/project-search.ts`, `src/lib/projects.ts`, `scripts/markdown-code.mjs`, `scripts/check-site.mjs`, `scripts/format.mjs`, `scripts/astro.mjs`, `scripts/serve.mjs`, `tests/project-schema.test.ts`, `tests/project-metadata.test.ts`, `tests/project-search.test.ts`, `tests/fixtures/projects/**`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `Makefile`.
   - **Orchestrator-owned files:** `docs/development.md`, this spec's progress/change log, queue/handoff/memory records.
   - **Verification:** `make check`; published-without-image rejection; invalid dates/taxonomy; deterministic search and date tests; dependency compatibility; original safeguards remain passing.

2. **Shared design and typography — (M), [serial].** Build the responsive visual shell, header/footer, metadata wrapper, prose styles, code styling, fonts, and 404 page. The homepage may remain structurally minimal until slice 4.
   - **Worker-owned files:** `src/layouts/Page.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/Seo.astro`, `src/styles/global.css`, `src/styles/prose.css`, `src/styles/code.css`, `src/pages/404.astro`, `src/pages/projects/index.astro` (minimal empty catalog route so shared navigation works; full catalog belongs to slice 4), `public/fonts/**`, `public/favicon.svg`, `src/pages/index.md` (temporary layout/frontmatter and approved title/introduction; final composition belongs to slice 4).
   - **Orchestrator-owned files:** `docs/development.md`, spec/queue/handoff/memory records.
   - **Verification:** `make check`; parent desktop/mobile typography, contrast, font loading, code-frame, and keyboard review using local fixtures.

3. **Project page and image gallery — (M), [serial].** Render the detail route, metadata, article, thumbnail carousel, and progressively enhanced dialog against the frozen content contracts.
   - **Worker-owned files:** `src/pages/projects/[slug].astro`, `src/layouts/Project.astro`, `src/components/ProjectMeta.astro`, `src/components/ProjectGallery.astro`, `src/scripts/project-gallery.ts`, `src/styles/project.css`, `scripts/check-site.mjs`, `tests/project-pages.test.ts`, `tests/fixtures/projects/**`.
   - **Orchestrator-owned files:** spec/queue/handoff/memory records.
   - **Verification:** `make check`; parent one/multiple-image dialog review, complete images/captions, keyboard/focus, mobile scrolling, script-disabled fallback, and article/code rendering. Use temporary fixture content, not invented public entries.

4. **Landing page and searchable catalog — (M), [serial].** Replace the scaffold homepage with the approved composition; implement cards, filters, URL state, result counts, and responsive catalog layout.
   - **Worker-owned files:** `src/pages/index.astro`, `src/pages/index.md` (remove after replacement), `src/pages/projects/index.astro`, `src/components/ProjectTile.astro`, `src/components/ProjectCard.astro`, `src/components/ProjectFilters.astro`, `src/scripts/project-index.ts`, `src/styles/landing.css`, `src/styles/project-index.css`, `scripts/check-site.mjs`, `tests/project-catalog.test.ts`, `tests/project-schema.test.ts` and `tests/project-pages.test.ts` (temporary cache isolation only), `tests/fixtures/projects/**`.
   - **Orchestrator-owned files:** spec/queue/handoff/memory records.
   - **Verification:** `make check`; parent zero/one/two/three/four-project layouts, long labels, combined and empty-result filters, URL restoration, mobile cards, keyboard access, and no-script listing.

5. **Half-Life: Continuum Edition onboarding — (L), [serial].** Gather project history/media with the maintainer prompt, settle accurate metadata with the user, prepare the article and images, review locally, and mark the entry publishable only after that review. Preparation can start during earlier slices, but content integration and shared-doc edits remain serialized.
   - **Worker-owned files:** `src/content/projects/half-life-continuum-edition.md`, `src/assets/projects/half-life-continuum-edition/**`, `src/data/project-taxonomy.ts` (reviewed identifiers only).
   - **Orchestrator-owned files:** `docs/project-onboarding.md`, `docs/projects/half-life-continuum-edition.md` (source/date/media provenance and review record), spec/queue/handoff/memory records. The orchestrator writes the article brief from the user's input; workers do not invent the project's story or review decisions.
   - **Verification:** `make check`; parent image/copy/source review, development-date evidence, link checks, thumbnail crops and enlarged image quality; user's final content review.

6. **Launch workflow and final review — (L), [serial].** Add publication workflow, sitemap/robots, update authoring/launch instructions, run final site acceptance, then carry out the reviewed publication/domain steps when authorized.
   - **Worker-owned files:** `.github/workflows/check.yml`, `src/pages/sitemap.xml.ts`, `public/robots.txt`, `src/components/Seo.astro`, `scripts/check-site.mjs`, `scripts/format.mjs`, `astro.config.mjs`, `package.json`, `package-lock.json` (only if needed for final checks).
   - **Orchestrator-owned files:** `docs/development.md`, `docs/launch.md`, `PROJECT.md`, `docs/project-onboarding.md`, this spec, `docs/DEFERRED.md`, queue/handoff/memory records; GitHub Pages and Route 53 operations after the concrete launch review.
   - **Verification:** `make check`; parent full acceptance/browser review; inspect the exact artifact/workflow; after authorized publication, verify GitHub Actions, HTTPS/domain routing, and live site. No dummy content or unreviewed draft is published.

## Open Questions

None. The user approved portfolio-publication recency, completion-year filtering, literal token search, and the integrated project/article model with the full spec. Final Half-Life media, article, taxonomy, and dates are explicitly assigned to slice 5; final DNS values are verified against live settings in slice 6.

## Deferred / Follow-ups

- Onboard Vintage, matrix-screensaver, capture-view, BeamVM, and VintageVault individually after the first project; no readiness or publication is assumed.
- Independent blog posts/index and an RSS feed, if writing expands beyond project stories.
- Embedded video or richer comparison media after the still-image gallery and external video link are established.
- Full-article/fuzzy search, multiple selections per filter, extra filters, and pagination if the catalog grows enough to need them.
- A light theme or theme switcher if requested later.

## Change Log

- 2026-09-08 — First-pass Continuum cover/GIF integrated with approved prose preserved. Parent checks passed 43 tests, zero diagnostics/privacy findings, a temporary public media build, desktop/mobile crop/layout review, cover viewer, and real draft exclusion. Optimized animation retains the original 19.26-second loop; entry remains a draft pending remaining metadata and assembled-content review.
- 2026-09-08 — User approved the rendered style/theme/colors/fonts and Continuum write-up, then requested a first-pass cover thumbnail and the README GIF within the article. Inline local GIF use is authorized; preserve approved prose and verify animation. Selected existing full-resolution Continuum menu artwork as the cover candidate for review.
- 2026-09-08 — User supplied the actual Continuum start date, June 9, 2026, superseding the June 11 public-commit candidate, and explained choosing the project as a challenge for Fable's perceived advance. The draft records the confirmed start; June 22 remains the proposed completion endpoint (13 calendar days).
- 2026-09-08 — User clarified Continuum's development process: extensive human project direction and repeated feature review; Claude performed all research and implementation using Fable/Opus. Refined the draft and maintainer brief to state that distinction and describe engine MCP debugging, simulated input, and gameplay/demo tooling. Date/taxonomy/media review remains pending.
- 2026-09-08 — Prepared the first incomplete Continuum article from the user's motivation and emphasis on entity contact shadows/seamless transitions, with confirmed Claude Fable attribution. Left unreviewed dates, taxonomy, and images unset. Parent verification passed 43 tests, zero type/privacy findings, desktop/mobile draft review, and direct production-exclusion checks. Captures and final content review remain pending.
- 2026-09-08 — User accepted slice 4 and authorized slice 5, Half-Life: Continuum Edition onboarding. Gathering project story, media selections, metadata, and project-specific development-date evidence; final content review remains pending.
- 2026-09-07 — Slice 4 implemented and independently verified: recent homepage tiles, rich catalog cards, progressive search/filters/URL state, and separate dev draft previews. Parent checks passed 43 tests, zero type diagnostics/privacy findings, layouts for every zero-to-four homepage count, native browser/history/no-script/touch behavior, fallback/reconnection, and draft separation. All temporary build caches are isolated; no real project content or publication was added.
- 2026-09-07 — Slice 4 concurrent fixture builds exposed shared Astro caches through symlinked dependencies. Extended ownership to isolate caches in the two existing build-fixture tests as well as the new catalog test; production configuration and product behavior are unchanged.
- 2026-09-07 — User accepted slice 3 and authorized slice 4. Added an owned catalog fixture-build test file. Development draft cards will appear in a separate labeled preview section, excluded from the public search index/counts; this implements the approved local-authoring/publication boundary.
- 2026-09-07 — Slice 3 implemented and independently verified: public/dev project routes, metadata/article layout, optimized thumbnail carousel, and accessible original-image viewer. Parent browser review compacted metadata and corrected disabled-button focus and reachable scroll-snap edges. Final checks passed 39 tests, zero Astro type diagnostics/privacy findings, actual route fixtures, live draft updates, and native keyboard/touch/reduced-motion/no-script behavior. No real project content was added.
- 2026-09-07 — User accepted slice 2 preview images and authorized slice 3. Added an owned project-page fixture-build test file to cover route publication/draft separation and actual gallery markup; no design change.
- 2026-09-07 — Slice 2 implemented and independently verified: shared dark shell, self-hosted Inter/JetBrains Mono, metadata, prose/code styling, and useful navigation/404. Parent browser review refined Copy into the title bar with a smaller glyph and preserved target size. Final parent checks passed 38 tests, zero Astro diagnostics/privacy findings, and all three routes. Desktop/tablet/mobile, 200% content zoom, local font loading, keyboard/Copy, and overflow checks passed. Page/Seo APIs and font provenance are documented in the development guide.
- 2026-09-07 — User accepted slice 1 and authorized slice 2. Slice 2 includes the approved homepage title/introduction and a minimal empty Projects route to keep shared navigation functional before slice 4; no new product behavior or project content is introduced.
- 2026-09-07 — Slice 1 implemented and independently verified: strict route-independent content validation, public/dev query contracts, UTC metadata and local search helpers, framed Markdown code, and built-output checks. Parent review added malformed-URL/HTML-link regressions and live dev checks; runtime-mode and watcher fixes preserve the approved local-preview behavior. Final parent `make check`: 38 tests passed, zero Astro diagnostics, zero privacy findings, static build/output checks passed. Live content/image edits, invalid-edit recovery, deletions, and server shutdown passed. Shared design starts in slice 2 after user review.
- 2026-09-07 — Slice 1 ownership extended to the existing Astro/serve wrappers: parent live verification found inherited `NODE_ENV=production` disables draft preview. Explicit command-appropriate modes are a tooling correction within the approved dev/production behavior, not a design change.
- 2026-09-07 — User approved the full spec and authorized slice 1. Initial Planning is accepted; implementation begins with content contracts and tooling.
- 2026-09-07 — Created draft from the initial idea, approved foundation, approved design discussion, and initial Continuum research. Added content/search/date contracts, serial owned-files plan, onboarding, and launch verification. Full spec awaits user review.

### Research references

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/) — validated build-time Markdown collections and public/draft selection.
- [Expressive Code installation](https://expressive-code.com/installation/), [editor frames](https://expressive-code.com/key-features/frames/), and [themes](https://expressive-code.com/guides/themes/) — renderer integration and presentation capabilities; package compatibility also checked directly against npm metadata.
- [Inter](https://github.com/rsms/inter) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) — font sources and licenses.
- [Astro Pages deployment](https://docs.astro.build/en/guides/deploy/github/) and [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) — recheck action versions and exact domain instructions at launch.
- [Continuum](https://github.com/bishopdynamics/Continuum) and [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0) — initial project and release evidence.
