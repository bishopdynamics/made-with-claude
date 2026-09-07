# Initial Design Discussion

2026-09-07. Discussion record for Initial Planning. The user approved the proposed visual direction and layouts (“that sounds right to me”); these are incorporated into `docs/spec/ROOT_SPEC.md`. The user subsequently approved the full implementation spec and authorized slice 1. Preserve the user-authored `initial-idea.md` as the original input.

## User requirements

- First project: **Half-Life: Continuum Edition**. The user says it is complete, publicly released, and already has media we can start with. User-supplied public repository: <https://github.com/bishopdynamics/Continuum>. Media selection is pending.
- Visual direction: black background, non-white text, and nice free fonts throughout.
- Accent: **muted amber**, selected by the user during this discussion; the proposed starting palette was subsequently accepted with the overall visual direction.
- Code blocks must render correctly in a dark style resembling a small code editor.
- Projects are made using Claude and/or Codex under the guidance of BishopDynamics.

### Landing page

1. Title at the top: **What Claude/Codex Made**.
2. Description along the lines of: “these projects were all made by Claude and/or Codex under the guidance of BishopDynamics”. Wording can be refined.
3. A 2×2 grid featuring thumbnail images from four recent projects, each with its title along the bottom of the image.
4. A large **All Projects** link to the project index.

### Project index

- A list of project cards with text search and filters.
- Every card includes a title, brief description, languages used, development duration, and one thumbnail image.
- An image is mandatory: every published project needs at least one representative image.
- Projects have tags, enabling filtering by something other than timeframe.
- The user suggests deriving development start and finish from Git logs: the beginning of the project and its most recent commit.
- Clicking a card opens that project's page.

### Project page

1. Title and description.
2. A carousel of image thumbnails; clicking a thumbnail enlarges it.
3. Long-form project explanation/blog beneath the gallery.

## Design recommendations and review

The user accepted the palette, fonts, compositions, editor presentation, single-project treatment, and reviewed development-date approach below. Homepage recency and detailed search behavior were approved with the full root spec.

- Palette: near-black `#080808` background, charcoal `#141414` surfaces, warm light-gray `#D2D0CB` body text, pale-gray `#E5E3DE` headings, and muted-gray `#A09F9A` metadata. Use thin borders, modest corner rounding, and generous spacing.
- Accent application: muted amber `#D4A15A` for links, selected filters, and keyboard focus. Keep project imagery prominent.
- Typography: Inter for headings, body, and controls; JetBrains Mono for code. Self-host font files with their licenses. Both are available under the SIL Open Font License: [Inter](https://github.com/rsms/inter), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono).
- Landing composition: left-aligned heading and introduction, wide landscape thumbnails, and a dark gradient behind overlaid titles. Single-column layout on narrow screens. Until four projects are published, show only existing projects and let a sole project span the available width.
- Project-index composition: horizontal cards with the thumbnail on the left and text/metadata on the right, stacking on mobile. Search above the list; compact tag, language, and year filters with a visible result count and clear action. Exact taxonomy and matching behavior remain for the spec.
- Project-page composition: a manually scrolled thumbnail carousel with arrows and touch scrolling, opening a full-image viewer with previous/next controls, captions, keyboard navigation, Escape to close, and focus restoration. Long-form text uses a narrower reading column than the gallery. Avoid automatic slide changes.
- Code presentation: a charcoal editor panel with a slim filename/language bar, Copy control, syntax highlighting, preserved indentation, and horizontal scrolling for long lines. Line numbers can be optional for walkthroughs. Astro supports Markdown syntax highlighting through Shiki; see [Astro documentation](https://docs.astro.build/en/guides/syntax-highlighting/). Final editor-frame integration remains an implementation choice.
- Development duration: use Git history as evidence, review the first project-specific commit and a completion/release endpoint with the user, then store those dates. Existing upstream history or later maintenance commits may make raw first/last repository commits misleading. Label the measure as a development span, not hours worked; track later updates separately.
- Define homepage recency by publication on this portfolio so the homepage introduces newly added projects; approved with the full spec.
- Suggested intro: “Projects made by Claude and/or Codex, under the guidance of BishopDynamics.”

## Continuum research

- The [README](https://github.com/bishopdynamics/Continuum) describes uninterrupted Half-Life campaign play and a controller-first menu, plus optional visual improvements. It links a [gameplay video](https://youtu.be/DVSHgFvknj0). The video itself has not been reviewed.
- The [menu documentation](https://github.com/bishopdynamics/Continuum/blob/main/doc/menu.md) contains [menu-tour.gif](https://raw.githubusercontent.com/bishopdynamics/Continuum/main/doc/media/menu-tour.gif), inspected locally: 640×360, 154 frames. Its opening frame shows orange Half-Life artwork and the Continuum menu. Useful for a design study; recommend a higher-resolution capture for large gallery viewing. No media has been copied into site content or approved for publication.
- The repository also has internal chapter thumbnail images. One inspected example (`valve_c1a0.png`) is 512×288 and includes an on-screen diagnostic message, so existing internal thumbnails should not automatically become portfolio assets.
- GitHub's public API lists release [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0), published 2026-06-22, with Linux, macOS ARM64, Windows, and Flatpak downloads.
- Continuum is an umbrella over engine, menu, and SDK forks. Its own Git history and language totals may not capture all project work; review the relevant repositories when preparing duration and language metadata.

## Pending discussion

- Half-Life: Continuum Edition media selection and any higher-resolution captures needed.
- Select the actual project-specific start and completion dates during onboarding; the reviewed-date approach and initial single-project homepage treatment are approved.
