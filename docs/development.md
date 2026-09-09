# Development

Hephaestion builds a static portfolio and blog for `madewithclaude.com`. The site is developed locally and will be published by GitHub Actions to GitHub Pages.

## Setup and commands

Install the Node.js version in `.nvmrc`, with npm, Git, and Make available. Run `make setup` after cloning. It installs dependencies from `package-lock.json` and configures this repository's pre-commit hook. If setup finds an existing custom hook configuration, it stops so the two can be reconciled instead of replacing it.

| Command | Purpose |
| --- | --- |
| `make help` | List commands; also the default `make` action. |
| `make setup` | Install locked dependencies and the pre-commit hook. |
| `make run` | Start the local development server; use the URL it prints. |
| `make build` | Generate the static site in `dist/`. |
| `npm run preview` | Serve the production build locally after building. |
| `make test` | Run focused tests for the development safeguards. |
| `make check` | Run the same checks required by CI. |
| `make format` | Format application and tooling files. |
| `npm run privacy:staged` | Check the exact file contents staged for commit. |
| `npm run privacy:check` | Check repository content before sharing it. |

Use the development server for rapid editing and the production preview to inspect build output before publishing. Neither operation requires a push.

## Layout

- `src/pages/`: routes, including Markdown pages.
- `src/layouts/` and `src/components/`: page shells and reusable presentation.
- `src/content/`: project and blog content as the content model is developed.
- `src/assets/`: source images processed by Astro.
- `public/`: assets copied unchanged into the build; everything here is public when deployed.
- `scripts/`: setup and repository checks.
- `.githooks/`: versioned Git hooks installed by setup.
- `.github/workflows/`: GitHub Actions checks; deployment will be added for launch.
- `.bishop/`: versioned project metadata, kept in Git by the user's explicit choice.

Create folders as their content is needed. Keep private notes, unreviewed screenshots, credentials, and exported sessions out of published content and build assets.

## Tooling decisions

Node is pinned in `.nvmrc`; direct npm dependencies are pinned and `package-lock.json` is committed. TypeScript 6 is used because the installed Astro checker does not support TypeScript 7. `.npmrc` includes development dependencies explicitly, so the site's build/check tools are installed even if the local npm default omits them.

The Astro wrappers disable telemetry. Dev and preview use Astro's documented experimental programmatic API to remain in the foreground, including in an agent environment where the Astro CLI would detach them. Keep Astro pinned and recheck startup/shutdown behavior when upgrading. Secretlint scanner rules are registered directly without its comment-suppression filter; the tests verify that suppression comments cannot hide credentials.

The wrappers also select the runtime mode explicitly: dev uses `NODE_ENV=development`, and build/production preview use `production`. This matters on hosts with a global `NODE_ENV`: an inherited production value otherwise disables draft preview and live reload, while an inherited development value must not enable draft queries during a production build. Check/sync preserve the inherited environment because they do not publish or serve content.

## Project content and authoring contracts

The approved content model is in `docs/spec/ROOT_SPEC.md`; the onboarding process and copy/paste maintainer prompt are in `docs/project-onboarding.md`. Project entries will live in `src/content/projects/<slug>.md`, with their image assets under `src/assets/projects/<slug>/`. The first entry is prepared separately from the content-tooling slice.

Content defaults to a draft. Incomplete draft metadata is allowed, but publication requires a title, description, article, valid publication/development dates, repository URL, known language/tag values, at least one gallery image with alt text, and a cover pointing to that gallery. Filenames are canonical lowercase kebab-case slugs. Dates are date-only `YYYY-MM-DD` strings, and development duration is elapsed calendar time calculated in UTC.

Inline article images use ordinary Markdown paths relative to the content file, such as `../../assets/projects/<slug>/menu-tour.gif`; keep those assets in the project's source-image directory. The cover/still gallery remains in frontmatter. The user authorized an inline GIF for Continuum's first media pass. Astro processes it as animated WebP, so verify animation and total playback duration in the rendered output rather than requiring the delivery filename or frame count to match the original. Preserve the original GIF in source control and let prose images shrink to the viewport without stretching beyond their native size.

The collection uses a custom loader built on Astro's loader API. It validates raw filenames, frontmatter, article bodies, and local images during content synchronization, before routes can consume them. It revalidates entries instead of allowing an unchanged-content digest to bypass updated validation rules. This is deliberate: validation must still fail a build when project routes have not yet been implemented. Live development watches content and referenced image directories.

Public consumers use the shared public-selection/query contract; development author previews explicitly opt into draft queries. Public search records contain only the metadata needed by the catalog, excluding drafts, article bodies, and image objects. Search combines literal normalized tokens with tag/language/completion-year filters. Filter choices come from the complete public catalog, not the current result subset. The portfolio publication date controls default ordering independently of development completion and later updates.

The taxonomy registry starts empty until a real entry's metadata is reviewed. Unit/build fixtures supply a separate synthetic taxonomy and never become published projects. Do not add made-up production metadata to exercise a test.

| Module | Contract for later slices |
| --- | --- |
| `src/lib/projects.ts` | `getPublicProjects()` is the production query; `getProjectsForDevelopment()` explicitly permits drafts only during development. |
| `src/lib/project-metadata.ts` | Public selection/order, UTC calendar validation and duration formatting, project links, and cover lookup. |
| `src/lib/project-search.ts` | Public search records, normalized literal matching, filter options, combined filtering, and URL parsing/serialization. No runtime schema or collection imports enter the browser search graph. |
| `src/lib/project-schema.ts` | Injectable schema, local-image path rules, raw filename/duplicate checks, and published article validation. |
| `src/types/projects.ts` | Shared project, image, taxonomy, and search types; resolved gallery sources are Astro image metadata. |

Search records are plain serializable data, not pre-escaped HTML. If embedding JSON in an HTML script element, escape `<` as `\u003c` before using `set:html`, or use another safe transport. Browser code should use text APIs to display labels and query text.

## Code blocks and checks

`scripts/markdown-code.mjs` configures `astro-expressive-code` and its line-number plugin, both pinned to 0.44.2. Fenced code gets a dark editor frame with a filename/title or language label, a Plain text fallback for unknown languages, and optional `showLineNumbers` metadata. Copy data preserves original tabs, indentation, and filename comments. JetBrains Mono is loaded from the local font assets. `src/styles/code.css` places the Copy control and feedback in the title bar, preserving a 44px target and 20px glyph without covering source text; long filenames wrap within reserved space.

Direct dependencies include Shiki 4.4.3 for the supported-language registry, parse5 8.0.1 for actual HTML parsing in output checks, and Node 22 types. These imports are explicitly declared rather than relying on incidental transitive dependencies. The existing Astro and TypeScript pins remain unchanged.

`make test` now runs the original safeguards and TypeScript contract tests using Node 22 type stripping. It includes isolated temporary Astro builds for publication validation, caching, image resolution, draft exclusion, and real Markdown rendering. Temporary fixtures never enter the site's source collection or final build. `npm run build` also runs `scripts/check-site.mjs`, which checks actual HTML references (including responsive image candidates) and directory index files. Only `/` is required in slice 1; later slices extend required-route/project expectations as those pages are implemented.

Parent live verification also exercised creating a collection after dev startup, draft edits, publication, changed image dimensions, invalid-edit recovery, deletions, and server shutdown. Watcher roots are normalized and file/directory listeners registered individually so Astro can track listener cleanup.

## Shared layout and fonts

`src/layouts/Page.astro` supplies the head, header/footer, skip link, and single `main#main-content`. Authors supply the H1. It accepts these optional direct props, or the same values through Markdown frontmatter: `title`, `description`, `canonical` (string/URL), `noindex` (boolean), `image` (`{ src: string | URL, alt: string }`), `prose` (boolean), and `variant` (`standard` or `home`). Direct props take precedence. Prose defaults on for Markdown callers and off for direct Astro callers so gallery/catalog layouts can use the wider container.

`Seo.astro` accepts the metadata subset of those options. It supplies one escaped title/description, canonical and social metadata, theme color, and favicon. Canonicals default to the pathname on the configured site and omit query strings/fragments. The 404 sets `noindex`. The initial homepage, empty Projects route, and 404 use no client scripts; the full homepage and searchable catalog remain in slice 4.

`src/styles/global.css` owns palette/font/spacing tokens and shared `.container`, `.page-intro`, `.button-link`, and `.button-link-primary` classes. `.prose` in `prose.css` constrains article width, styles semantic Markdown elements, and contains wide tables/long inline code. Code-renderer markup is excluded from generic prose rules. The single dark theme persists under light system preferences; reduced-motion rules disable decorative transitions/animations.

Font assets are original Inter v4.1 variable upright/italic and JetBrains Mono v2.304 regular/italic WOFF2 files. Only upright Inter is preloaded; the other three faces load when used. The full unmodified binaries total 928,244 bytes. Exact source URLs, sizes, checksums, and original licenses are in `public/fonts/README.md`. No dependency or privacy-policy exception was needed. The small favicon is original SVG using the site palette.

The upstream `JetBrainsMono-OFL.txt` has a trailing space on line 21. It is intentionally preserved so the imported license remains byte-for-byte identical to its recorded source. A staged `git diff --check` reports that one vendor line; authored files must still pass the normal whitespace check. Do not run a blanket formatter over the original font licenses.

Slice 2 parent browser review used an isolated temporary Markdown fixture, covering real font loading (all four faces), semantic headings/lists/tables, keyboard skip/focus and table scrolling, code/long-title overflow, and exact keyboard-triggered Copy. Layouts were inspected at 375/768/1440px and 200% content zoom. Reduced-motion declarations were activated through the CSSOM for cascade verification because the browser connector's separate CDP calls do not retain emulation state. The fixture is not source content; only review screenshots/logs are retained under the ignored slice run directory.

## Project pages and gallery

`src/pages/projects/[slug].astro` builds paths from the public query in production and explicitly includes drafts in development. It renders the collection Markdown through `Project.astro`, which accepts `{ project: ProjectEntry }` and article content through its default slot. Incomplete drafts omit unavailable metadata/images, retain a visible Draft preview label, and use noindex. New and edited draft routes were verified in a running dev server; they remain absent from production output.

`ProjectMeta.astro` accepts `{ project: ProjectEntry<unknown> }` and renders semantic language/tag/date metadata plus available Source, Download, and Video links. Metadata groups wrap compactly; date values and the calendar-duration distinction remain visible. `ProjectGallery.astro` accepts `{ images, id, coverId?, coverPosition? }`; its ID must be unique on the page. The article uses `.project-article.prose`, while the gallery uses the wider shared container.

Thumbnails use Astro derivatives at widths up to 240/480/720px, capped to their source size. They may crop inside a 16:10 thumbnail frame; full images preserve their original resolution and aspect ratio. Each thumbnail's native link is the fallback when scripts or dialog support are absent. Full images are requested one at a time when opened/navigated, not preloaded into hidden image elements. Caption/dimension data travels through escaped attributes; captions are displayed with `textContent`.

The `project-gallery` custom element supplies manual strip controls and a native modal viewer. Long captions have a bounded keyboard-scrollable region; images use contain sizing so controls stay available even for portraits or shallow viewports. Loading failure keeps Close, navigation, and a full-image link usable. Close restores the original thumbnail focus, page scroll, and prior inline scroll-lock styles. The component aborts listeners, disconnects observers, and releases scroll locking when removed; reconnection was checked.

Two browser-found edge cases are deliberately handled: focused Previous/Next controls move focus to an enabled viewer control before becoming disabled, and Tab/Shift+Tab wrap at modal boundaries. Strip controls compare the first/last thumbnail's visible bounds rather than assuming reachable snap positions equal scrollLeft zero/maximum. Keep scroll padding aligned with strip padding when changing styles.

`tests/project-pages.test.ts` builds the actual routes in temporary storage with synthetic raster fixtures, checks public/draft separation, safe text, metadata/article order, native full-image links, and generated thumbnails. `scripts/check-site.mjs` additionally inspects generated project-page/gallery markup. A build of the still-empty real collection can emit Astro's expected empty-collection notice until onboarding adds the first project.

Slice 3 parent verification included persistent Playwright contexts for real touch swipes, reduced-motion preferences, and JavaScript-disabled navigation, plus keyboard boundaries, image-load failure/recovery, mobile/desktop/portrait/long-caption layout, and an effective 200% viewport. The existing browser tool's installed runtime was used; Playwright was not added as a project dependency. Review scripts, logs, and screenshots are retained only in the ignored slice run directory.

## Homepage and searchable catalog

`src/pages/index.astro` renders the first four entries from `getPublicProjects()` in publication order. `ProjectTile.astro` accepts `{ project: PublishedProjectEntry<ProjectEntry>, single?, loading? }`; covers retain their authored focal position and titles sit over a dark gradient. `.recent-projects-single` gives a lone project the full row. Zero/two/three/four states use the same layout without fabricated entries; All Projects remains a working route link.

`ProjectCard.astro` accepts `{ project: ProjectEntry, loading? }` and renders one full-card link containing the cover, title/description, language labels, development span, and tags. Published cards require a cover. Incomplete draft cards can omit unavailable metadata and show a draft-only cover placeholder. `ProjectFilters.astro` accepts `{ options: ProjectFilterOptions, id?, resultsId? }`; its form is initially hidden and has fields named `q`, `tag`, `language`, and `year`.

The `<project-index>` element uses the existing pure search/URL helpers. Public cards arrive in the HTML, and a small escaped JSON index supplies only public search metadata. Controls become visible after initialization succeeds. Filtering toggles the existing result items rather than replacing their HTML. Raw query text and caret are preserved while typing; normalized matching and URL serialization happen separately. The visible count updates immediately, while a separate polite live region waits 200ms after changes.

Filter changes replace the current URL entry, preserving other query parameters, hash, and existing history state. Popstate and persisted pageshow restore form/results from the URL. Enter does not reload the page. Both Clear actions reset the known search fields and return focus to the query. Disconnect cleanup removes listeners/timers and restores a usable static listing; malformed metadata leaves that fallback intact.

Development draft cards are a separate labeled section outside the enhanced public list. They never contribute to homepage tiles, public JSON, filter choices, or counts, even in development. The real collection is still empty before the first project onboarding, so its production empty states and Astro's empty-collection notices are expected.

All actual fixture-build tests use `isolateFixtureCaches(root)` from `tests/fixtures/projects/build-cache.ts` after copying configuration. Sharing node_modules through a symlink also shares Astro's default content cache; concurrent builds exposed cross-fixture contamination. The helper composes per-fixture Astro/Vite cache directories without changing the production configuration. Browser-review copies need the same isolation if they build alongside checks.

Slice 4 parent browser checks covered five sample projects, every homepage count from zero through four, long titles, mobile/effective200% layouts, caret/multi-word/punctuation input, combined filters, Clear/empty results, deep and invalid URLs, Back/Forward/detail return, persisted pageshow, script-disabled listing, malformed-index fallback, reconnecting, native touch on cards, and development-only draft separation. Review artifacts stay in the ignored slice run directory; no sample projects were added to production content.

## Before committing

Run `make check`, review the diff, then stage the intended files. The pre-commit hook reads Git's index, which is the content that the commit will contain. Editing a secret out of the working copy alone does not remove it from the staged version; stage the corrected file too.

Secretlint detects known credential patterns. Additional checks identify sensitive filenames and recognizable personal-information patterns. Findings should report locations and rule names without echoing the private value. Fix real findings; add only narrow, reviewed exceptions for intentionally public or clearly synthetic content. A missing scanner or a scanner failure must block the hook rather than silently pass.

The scanner accepts files up to 10 MiB each and blocks larger inputs for review. Optimize large screenshots before committing them. Privacy exceptions in `.privacy-policy.json` apply to one file, one rule, and the hash of one exact line, so edits require another review; credential detection has no such exception mechanism.

Checks include tracked `.bishop` files. Ignore rules are not a reason to skip an already tracked file. Generated build/dependency files and ignored local scratch files are excluded from normal working-file discovery.

Automated checks cannot prove that a screenshot or paragraph is safe to publish. Review images for names, account details, private windows, notifications, and metadata; use prepared demo data where possible. Review prose and the complete Git history before making the source repository public. Do not commit an actual credential to test the scanner.

## Publishing

The remote is named `github`. Initial repository synchronization uses `git push -u github main`; subsequent pushes use that upstream. The bootstrap Actions workflow performs checks only, so the initial repository push does not launch a website.

The launch implementation will build only intended site content and deploy `dist/` through GitHub Pages after successful checks. Configure `madewithclaude.com` in Pages and then connect the Route 53 DNS records. The user made the source repository public on 2026-09-07, resolving the private-repository Pages plan requirement. See [GitHub's Pages prerequisites](https://docs.github.com/en/pages/getting-started-with-github-pages) and [Astro's Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).
