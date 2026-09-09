# Half-Life: Continuum Edition onboarding

Status: first-pass media integrated and independently verified, 2026-09-08. The user approved the rendered style/theme/colors/fonts and current write-up. Motivation, June 9 start date, feature emphasis, and human/Claude roles are confirmed. The requested cover thumbnail and README GIF are ready in the local draft; completion date, taxonomy, and final assembled-media review remain pending.

## Identity and source

- Canonical title: **Half-Life: Continuum Edition**, selected by the user.
- Public source: <https://github.com/bishopdynamics/Continuum>.
- The umbrella links three related forks: [engine](https://github.com/bishopdynamics/xash3d-fwgs), [menu](https://github.com/bishopdynamics/mainui_cpp), and [game SDK](https://github.com/bishopdynamics/hlsdk-portable). Their upstream history must not be counted as Continuum development.
- Public documentation snapshot inspected 2026-09-08: [`00ba9c640625a0663df3470910419db132969c9b`](https://github.com/bishopdynamics/Continuum/tree/00ba9c640625a0663df3470910419db132969c9b). This identifies the research inputs; it is not an approved capture version or development endpoint.

## Candidate description and story

Working description for discussion: “Half-Life on Xash3D, with seamless level transitions, entity contact shadows, and a controller-first menu.”

The [public README](https://github.com/bishopdynamics/Continuum) describes an Xash3D-FWGS fork, requiring the player's original game data, that adds a unified menu and removes loading screens between maps. It does not claim to replace the original game's content. Keep the portfolio focused on Continuum's additions and credit the upstream game and engine.

The article leads with the user's motivation, then the two features they are proudest of. The menu supplies supporting context:

- [Entity contact shadows](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/ambient-occlusion.md): the documented entity contact AO grounds moving characters and props with soft shadowing that fades as they lift off the floor. Distinguish this from world AO and from the flashlight's shadow maps; do not substitute another shadow system for the user's chosen emphasis.
- [Level transitions](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/level-streaming.md): resident world models, transition state held in memory, and continued audio. The documented experience includes a brief frame hold during a map swap; avoid wording that promises literally zero pause. Timing figures in the documentation have not been independently measured for this portfolio.
- [Controller-first menu](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/menu.md): a common game picker and settings screens that also work with mouse and keyboard.
- Optional [projected flashlight](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/flashlight.md) and [ambient occlusion](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/ambient-occlusion.md): choose a concrete example only if it serves the user's story. The documentation says the projected flashlight is off by default, while supplemental AO is on by default.

Confirmed by the user on 2026-09-08:

- They are a big fan of the Half-Life series and game engines, but had never really dug into GoldSrc.
- They admire Xash3D, and Claude Fable allowed them to jump straight into adding the features they wanted.
- The entity contact shadows and seamless level transitions are the pieces they are proudest of.
- They began on **June 9, 2026** and chose Continuum as a demanding challenge for the substantial leap forward they saw in Fable. The user identifies this as the day Fable first became available; the article presents their motivation and project start without independently asserting a vendor release chronology.

The user subsequently clarified the development process:

- **Human role:** project manager who directed Continuum extensively, crafted the initial plans, iterated on plans with Fable, and reviewed repeated feature results until satisfied.
- **Claude role:** all research and implementation, using a mixture of **Fable and Opus**. Claude presented results for the user's review. Repeat this distinction explicitly in the article; do not imply user-written code or autonomous project direction.
- **Iteration:** repeated planning, implementation, presentation, and fine-tuning for each feature, while improving the development toolset.
- **Engine debugging:** an MCP connection provided direct access to actual engine state, screenshot capture, and simulated input without taking over the user's real mouse, making testing, verification, and troubleshooting more efficient.
- **Gameplay tools:** capture and demo playback supported repeatable testing of trouble spots and recording demonstration footage.

This is the user's firsthand account. Use first-person prose and Fable/Opus names without invented version numbers or a Codex role. Attribute research and tooling implementation to Claude, with the user directing and reviewing. Exact MCP commands, connection architecture, and runtime details have not been independently inspected and are not needed for this prose account. Do not invent obstacles, performance figures, hours worked, or a feature-specific debugging anecdote.

The article is at `src/content/projects/half-life-continuum-edition.md` with `draft: true` and confirmed `startedOn: '2026-06-09'`. The user has approved its current prose; preserve it while adding media. Unreviewed completion/publication dates and taxonomy remain unset, and final entry publication is still pending.

## First-pass media

The user explicitly requested a cover image for thumbnails and the GIF linked in the README inside the article. This supersedes the earlier proposal to require fresh still captures before integrating media. The current README was fetched directly on 2026-09-08 and verified to reference `doc/media/menu-tour.gif`.

| Asset | Local source path | Provenance and dimensions | SHA-256 |
| --- | --- | --- | --- |
| Cover | `src/assets/projects/half-life-continuum-edition/cover.png` | Byte-for-byte copy of [Continuum's menu artwork](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/redist/continuum/gfx/shell/continuum/games_override/valve.png), 2204×1240, 4,319,147 bytes. The orchestrator inspected the full image: Gordon Freeman at right beside a large lambda on an orange textured background, without menu/debug overlays. Existing project artwork, not a new capture or generated image. | `350700d4c85e419457daa55f06a1bd41595079118f488525ea4c8824cd03c3c4` |
| Inline animation | `src/assets/projects/half-life-continuum-edition/menu-tour.gif` | Byte-for-byte copy of the [README GIF](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/media/menu-tour.gif), 640×360, 154 frames, 2,601,418 bytes. Reuse requested by the user. | `7f4e8c3f3d36a0dd1d163e7b3fbf3475a2f72fca7b9a80fc0accdb11e112d121` |

The cover is frontmatter image `cover`, also selected by `coverId`, so the existing thumbnail/gallery contract applies. The GIF belongs in the Markdown article after the introduction/authorship paragraphs and before the first feature section, with descriptive alt text and a short caption. Keep the existing source animation and aspect ratio intact; no upscaling, retouching, or new capture is part of this pass. Astro may generate delivery derivatives, which must retain the animation. Neither source is placed in `public/`.

Verified delivery: Astro emits an animated WebP at 640×360, 871,750 bytes. It coalesces the original GIF's 154 frames into 57 frames while preserving the **19,260 ms** duration and indefinite looping. Two browser screenshots taken 5.5 seconds apart while the image was visible confirmed playback advances. Desktop display is native 640×360; at 375px viewport the image scales to 335×188 without overflow. Cover derivatives serve the thumbnail sizes, while the existing gallery viewer loads the original 2204×1240 image with `object-fit: contain`.

## Media inventory

| Input | Evidence and inspection | Proposed use |
| --- | --- | --- |
| [Menu-tour GIF](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/media/menu-tour.gif) | 640×360, 154 frames, 2,601,418 bytes. Opening frame inspected: orange Half-Life background, root menu, controller hints, and visible lower-right version watermark. | User-selected inline article animation for this first pass. Preserve original source; fresh captures are optional follow-up work. |
| [Scripted menu tour](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/menu-tours/menu-tour.txt) | Text inspected. Describes root-menu, game-picker, load-game, gameplay, and configuration steps; references `tools/capture-menu-tour.sh`. Its overlay-suppression intent must be checked against the actual output. | Starting point for a repeatable maintainer capture plan. Capture tooling has not been executed or verified here. |
| [Gameplay demos](https://github.com/bishopdynamics/Continuum/tree/00ba9c640625a0663df3470910419db132969c9b/demos) | Tree listing includes tram ride, cascade, control room, houndeye, and unforeseen demos. Contents have not been played. | Maintainer can evaluate a suitable gameplay frame and reproducible camera position. |
| [Linked gameplay video](https://youtu.be/DVSHgFvknj0) | Linked from the public README; not watched in this session. | Candidate external link for demonstrating transitions; review contents and link before integration. |
| Internal chapter thumbnails | Prior planning inspected a 512×288 example with a diagnostic overlay. | Reference only; do not automatically reuse as portfolio imagery. |

Research downloads remain in ignored `.agent-worktrees/_runs/root-slice-5/research/`; the two selected sources are copied into the article's `src/assets/` directory. Other research media remains outside site content.

## Optional later captures

These earlier capture ideas remain available for a later pass, not prerequisites for the user-selected cover/GIF. Caption/alt text must be revised against any actual future captures.

| Image | What it should demonstrate | Capture requirements | Candidate caption / alt text |
| --- | --- | --- | --- |
| Cover: root menu | Continuum's identity and controller-first interface | Clean 16:9 still, ideally 1920×1080 or higher at native output; readable controls, title and artwork intact, version/debug overlays absent. Verify the site's title overlay does not cover relevant UI. | Caption: “Half-Life: Continuum Edition's controller-first menu.” Alt: “Continuum main menu with Game, Configuration, and Quit options over orange Half-Life artwork.” |
| Entity contact shadows: matched stills | One of the user's two proudest features: soft grounding shadows beneath characters/props | Use the same camera, entity pose, scene, and lighting for an on/off pair; change only entity contact AO, keeping world AO and other shadow settings fixed. Choose a surface where the effect reads clearly. Native resolution, ordinary HUD allowed, no diagnostic overlays. | Captions should identify contact shadows enabled/disabled. Alt text must describe the entity, surface, and visible shadow in each actual image. Use two ordinary gallery stills, not a new comparison widget. |
| Gameplay / transition video | The campaign experience and the user's other proudest feature | Evaluate a repeatable save/demo near a level boundary; review the existing external gameplay video for an uninterrupted crossing with audio. A still must not be described as proof of uninterrupted transitions. | Caption and alt text should name the actual scene. A video link/timestamp must be checked before it appears in the article. |
| Game picker (optional) | Supporting context: one interface for installed games and expansions | Only show games actually installed and supported in the selected capture build; keep game labels and controller hints readable. | Caption: “Choose an installed game from the unified menu.” Alt: describe the games and selected card actually visible in the final image. |

Preserve uncropped original files and record each capture's author, game/version, source, and any reuse conditions. A paired comparison is optional and should only be used when both captures share the same camera, scene, and lighting apart from the stated setting.

## Development dates and taxonomy

- Confirmed start: **2026-06-09**, supplied by the user from their firsthand account. This supersedes the June 11 candidate inferred from public Git history. The first visible project-specific engine change, [`42e54c9`](https://github.com/bishopdynamics/xash3d-fwgs/commit/42e54c9106e4843caa0c64d2800a2ac6d20ff909), introduces in-memory level-transition state at the independently verified timestamp `2026-06-11T20:58:24Z`. The initial [umbrella commit](https://github.com/bishopdynamics/Continuum/commit/06a798360d357ca2719eb5a8a09abf22fbef40f0) follows at `2026-06-11T20:59:31Z` with research and tooling through early milestones. These commits record work already underway; do not replace the user's June 9 start with the earliest visible commit date.
- Candidate completion: **2026-06-22**, using [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0). The orchestrator independently verified the release name, initial-release description, `published_at: 2026-06-22T19:10:26Z`, and Linux/macOS ARM64/Windows/Flatpak asset names. Later stabilization and maintenance do not automatically move this endpoint. The user still needs to choose the development endpoint.
- With the confirmed June 9 start and candidate June 22 release endpoint, the site's UTC calendar subtraction gives **13 days**. This is elapsed calendar time, not effort hours; the completion endpoint still awaits review.
- Candidate languages: **C, C++, Python, Shell**. The independently inspected engine commit above modifies C sources; the [Continuum menu commit](https://github.com/bishopdynamics/mainui_cpp/commit/7d38e9ad13aa644108c525acb78a4e0da3ba2e8d), dated `2026-06-12T09:43:59Z`, adds the C++ menu files. The initial umbrella commit adds `tools/hlstream_preprocess.py` and `tools/build-engine.sh`. C/C++ describe product implementation; Python/Shell describe project tooling. No language-byte percentages are proposed because the forks include substantial upstream code. If the user wants only runtime languages in cards, use C/C++ and explain the tooling in the article.
- Candidate tags for discussion: Games, Graphics, Desktop. No taxonomy identifiers have been added.
- Portfolio publication date remains unset until content is reviewed for publication; later maintenance must remain distinct from the development endpoint.

## Review record and next step

- 2026-09-08: user approved slice 4 and authorized onboarding.
- 2026-09-08: user supplied motivation, broad Claude Fable contribution, and contact-shadow/level-transition emphasis. Prepared the first incomplete article from those notes; shifted media planning toward those features.
- 2026-09-08: user clarified extensive project management/direction and that Claude did all research and implementation using Fable and Opus. Added this distinction near the article opening and a development-process section covering repeated reviews, engine MCP debugging, simulated input, and gameplay/demo tools.
- 2026-09-08: user corrected the project start to June 9, 2026 and explained choosing it as a challenge for the advance they saw in Fable. Set the draft start date and added that motivation; the June 11 public-history candidate is superseded.
- 2026-09-08: user approved the site's style/theme/colors/fonts and the write-up, then selected a cover plus the README GIF inside the article for first-pass media. Selected the full-resolution menu artwork as the cover candidate and preserved the original GIF source.
- Pending review: completion endpoint, languages/tags, and the assembled first-pass media. Motivation, start date, feature emphasis, human/Claude roles, prose, and the GIF choice are already answered; do not ask again.
- Public history evidence has been gathered and the decisive commits/release independently verified. Review the proposed dates/languages and capture set with the user.
- The [tailored maintainer brief](half-life-continuum-edition-maintainer-brief.md) remains available for later captures/history follow-up. It has not been sent to another maintainer or external service and is not required for the selected first-pass media.
- Continue the draft as reviewed dates/taxonomy and assets become available. Final desktop/mobile copy/gallery review precedes publication status changes.
- Initial draft verification: parent `make check` passed 43 tests, zero Astro diagnostics and privacy findings, and a three-page production build. Browser review at 1440px and 375px confirmed readable article sections, one H1, the draft label, and no horizontal overflow. A direct scan of all seven text output files confirmed the production artifact contains neither this draft route nor its content. Saved review images and check log are under ignored `.agent-worktrees/_runs/root-slice-5/`; temporary browser/server were stopped.
- Workflow/start-date refinement verification: parent `make check` passed again, including 43 tests, zero Astro diagnostics, zero privacy findings across 202 file snapshots, and the three-page production build. Log: `.agent-worktrees/_runs/root-slice-5/parent-workflow-check.log`. The earlier screenshots show the initial prose; no new browser session was needed for these paragraph and date edits.
- First-pass media verification: parent `make check` passed 43 tests, zero Astro diagnostics, and zero privacy findings across 204 snapshots. A separate temporary copy using test-only completion/publication/taxonomy metadata built all four public routes and actual media derivatives; its source was never published or copied back. Parent reviewed homepage/catalog crops, desktop/mobile article layout, visible animation, and the original cover viewer. The real production build still excludes the draft route/content; the existing preview on port 4321 includes the new assets. Logs/screenshots are under `.agent-worktrees/_runs/root-slice-5/`. Temporary public-copy server and directory were removed, review browsers closed, and the pre-existing port 4321 preview was left running.
