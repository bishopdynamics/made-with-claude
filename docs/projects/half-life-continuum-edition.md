# Half-Life: Continuum Edition onboarding

Status: research and intake in progress, 2026-09-08. The user accepted ROOT_SPEC slice 4 and authorized slice 5. Project copy, development dates, taxonomy, cover, and gallery are awaiting review; no site entry has been created.

## Identity and source

- Canonical title: **Half-Life: Continuum Edition**, selected by the user.
- Public source: <https://github.com/bishopdynamics/Continuum>.
- The umbrella links three related forks: [engine](https://github.com/bishopdynamics/xash3d-fwgs), [menu](https://github.com/bishopdynamics/mainui_cpp), and [game SDK](https://github.com/bishopdynamics/hlsdk-portable). Their upstream history must not be counted as Continuum development.
- Public documentation snapshot inspected 2026-09-08: [`00ba9c640625a0663df3470910419db132969c9b`](https://github.com/bishopdynamics/Continuum/tree/00ba9c640625a0663df3470910419db132969c9b). This identifies the research inputs; it is not an approved capture version or development endpoint.

## Candidate description and story

Working description for discussion: “A controller-first way to play Half-Life, with continuous campaign transitions and optional visual improvements.”

The [public README](https://github.com/bishopdynamics/Continuum) describes an Xash3D-FWGS fork, requiring the player's original game data, that adds a unified menu and removes loading screens between maps. It does not claim to replace the original game's content. Keep the portfolio focused on Continuum's additions and credit the upstream game and engine.

The technical notes offer three possible article threads:

- [Level transitions](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/level-streaming.md): resident world models, transition state held in memory, and continued audio. The documented experience includes a brief frame hold during a map swap; avoid wording that promises literally zero pause. Timing figures in the documentation have not been independently measured for this portfolio.
- [Controller-first menu](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/menu.md): a common game picker and settings screens that also work with mouse and keyboard.
- Optional [projected flashlight](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/flashlight.md) and [ambient occlusion](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/ambient-occlusion.md): choose a concrete example only if it serves the user's story. The documentation says the projected flashlight is off by default, while supplemental AO is on by default.

The user has been asked for the motivation, proudest result, and Claude/Codex contribution. These answers are pending. The README contains AI-assistance credits, but exact model attribution and the development process need the user's account before they become article copy. No performance numbers, firsthand experience, or personal motivation have been inferred.

## Media inventory

| Input | Evidence and inspection | Proposed use |
| --- | --- | --- |
| [Menu-tour GIF](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/doc/media/menu-tour.gif) | Downloaded for local research; 640×360, 154 frames, 2,601,418 bytes. Opening frame inspected: orange Half-Life background, root menu, controller hints, and visible lower-right version watermark. Other frames have not been visually reviewed this session. | Composition reference; request a higher-resolution still for the cover. No upscaling or synthetic reconstruction proposed. |
| [Scripted menu tour](https://github.com/bishopdynamics/Continuum/blob/00ba9c640625a0663df3470910419db132969c9b/menu-tours/menu-tour.txt) | Text inspected. Describes root-menu, game-picker, load-game, gameplay, and configuration steps; references `tools/capture-menu-tour.sh`. Its overlay-suppression intent must be checked against the actual output. | Starting point for a repeatable maintainer capture plan. Capture tooling has not been executed or verified here. |
| [Gameplay demos](https://github.com/bishopdynamics/Continuum/tree/00ba9c640625a0663df3470910419db132969c9b/demos) | Tree listing includes tram ride, cascade, control room, houndeye, and unforeseen demos. Contents have not been played. | Maintainer can evaluate a suitable gameplay frame and reproducible camera position. |
| [Linked gameplay video](https://youtu.be/DVSHgFvknj0) | Linked from the public README; not watched in this session. | Candidate external link for demonstrating transitions; review contents and link before integration. |
| Internal chapter thumbnails | Prior planning inspected a 512×288 example with a diagnostic overlay. | Reference only; do not automatically reuse as portfolio imagery. |

Research downloads remain in ignored `.agent-worktrees/_runs/root-slice-5/research/`. Nothing has been copied into `src/assets/` or `public/`.

## Proposed capture set

These are candidates for discussion, not approved images. Caption/alt text must be revised against the actual captures.

| Image | What it should demonstrate | Capture requirements | Candidate caption / alt text |
| --- | --- | --- | --- |
| Cover: root menu | Continuum's identity and controller-first interface | Clean 16:9 still, ideally 1920×1080 or higher at native output; readable controls, title and artwork intact, version/debug overlays absent. Verify the site's title overlay does not cover relevant UI. | Caption: “Half-Life: Continuum Edition's controller-first menu.” Alt: “Continuum main menu with Game, Configuration, and Quit options over orange Half-Life artwork.” |
| Game picker | One interface for installed games and expansions | Only show games actually installed and supported in the selected capture build; keep game labels and controller hints readable. | Caption: “Choose an installed game from the unified menu.” Alt: describe the games and selected card actually visible in the final image. |
| Gameplay | The finished play experience or one selected visual addition | Use a repeatable save/demo in a representative scene. Normal HUD is fine; remove console/diagnostic messages. Record any optional graphics settings. | Caption and alt text should name the actual scene and visible feature. A still must not be described as proof of uninterrupted transitions. |

Preserve uncropped original files and record each capture's author, game/version, source, and any reuse conditions. A paired comparison is optional and should only be used when both captures share the same camera, scene, and lighting apart from the stated setting.

## Development dates and taxonomy

- Candidate start: **2026-06-11**. The read-only history worker found the first clearly project-specific engine change at [`42e54c9`](https://github.com/bishopdynamics/xash3d-fwgs/commit/42e54c9106e4843caa0c64d2800a2ac6d20ff909), which introduces in-memory level-transition state. The orchestrator independently verified its author/committer timestamp, `2026-06-11T20:58:24Z`, and modified C files. The initial [umbrella commit](https://github.com/bishopdynamics/Continuum/commit/06a798360d357ca2719eb5a8a09abf22fbef40f0) follows at `2026-06-11T20:59:31Z` with research and tooling through early streaming milestones. These establish visible work, not the absence of earlier local/private work. Repository creation dates and inherited upstream commits are unsuitable proxies.
- Candidate completion: **2026-06-22**, using [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0). The orchestrator independently verified the release name, initial-release description, `published_at: 2026-06-22T19:10:26Z`, and Linux/macOS ARM64/Windows/Flatpak asset names. Later stabilization and maintenance do not automatically move this endpoint. The user still needs to choose the development endpoint.
- Both proposed endpoint dates are the same in UTC and Pacific time. The site's UTC calendar subtraction gives **11 days**; this is elapsed calendar time, not effort hours.
- Candidate languages: **C, C++, Python, Shell**. The independently inspected engine commit above modifies C sources; the [Continuum menu commit](https://github.com/bishopdynamics/mainui_cpp/commit/7d38e9ad13aa644108c525acb78a4e0da3ba2e8d), dated `2026-06-12T09:43:59Z`, adds the C++ menu files. The initial umbrella commit adds `tools/hlstream_preprocess.py` and `tools/build-engine.sh`. C/C++ describe product implementation; Python/Shell describe project tooling. No language-byte percentages are proposed because the forks include substantial upstream code. If the user wants only runtime languages in cards, use C/C++ and explain the tooling in the article.
- Candidate tags for discussion: Games, Graphics, Desktop. No taxonomy identifiers have been added.
- Portfolio publication date remains unset until content is reviewed for publication; later maintenance must remain distinct from the development endpoint.

## Review record and next step

- 2026-09-08: user approved slice 4 and authorized onboarding.
- Pending user input: motivation/proudest result, AI contribution, media source preference, and any newer captures.
- Public history evidence has been gathered and the decisive commits/release independently verified. Review the proposed dates/languages and capture set with the user.
- Use the [tailored maintainer brief](half-life-continuum-edition-maintainer-brief.md) if captures/history will be prepared in the Continuum project. This brief has not been sent to another maintainer or external service.
- After the factual story and assets are available, dispatch the content worker with a self-contained brief to create the draft Markdown and reviewed local images. Final desktop/mobile copy/gallery review precedes publication status changes.
