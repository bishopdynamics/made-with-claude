# Continuum portfolio capture and story brief

The user selected existing menu artwork plus the README GIF for the first media pass on 2026-09-08 and approved the current write-up. This brief is now an optional follow-up for fresh captures; it does not block that first pass. See the [active onboarding record](half-life-continuum-edition.md).

Copy the following prompt into the Half-Life: Continuum Edition maintainer session. It requests a plan and factual notes first. Review the scenes together before making captures.

---

We are preparing **Half-Life: Continuum Edition** as the first project on **whatclaudemade.com**, a portfolio of projects made with Claude and/or Codex under the guidance of BishopDynamics. The canonical source is <https://github.com/bishopdynamics/Continuum>.

Inspect the current public release, existing media, and the engine/menu/SDK forks, then propose a small, reproducible screenshot set for discussion with me. The website needs a 16:9 cover and a few supporting still images, with uncropped high-resolution originals available in its full-image gallery. Prefer native 1920×1080 or higher where the output stays representative and readable.

My motivation is already established: I am a big fan of Half-Life and game engines but had not really dug into GoldSrc. Xash3D is an amazing project, and Claude Fable let me jump into adding the features I wanted. **Entity contact shadows and seamless level transitions are the pieces I am proudest of.** Focus the article and supporting imagery on those two features. The portfolio already has an initial incomplete prose draft; this request fills in evidence and captures, rather than reopening the motivation.

The division of work is also established: **I directed the project extensively as project manager; Claude did all the research and implementation using Fable and Opus.** I crafted initial plans and iterated on them with Fable, then reviewed repeated results and refinements until satisfied with each feature. The development toolset grew alongside the features: an engine debugging MCP connection for live state, direct screenshots, and input simulation without taking over my real mouse; gameplay capture and demo playback for trouble-spot testing and demonstration footage. Use those existing capabilities when proposing reproducible captures, after checking how the current tooling works. Do not suggest that I wrote the code or that Claude directed the project autonomously.

I began on **June 9, 2026**, choosing this project as a demanding challenge for the substantial leap forward I saw in Fable. That firsthand start date takes precedence over June 11, the earliest clearly project-specific commits the portfolio session found.

Start by evaluating these candidates:

1. The root menu as a cover: Continuum title, orange artwork, visible controller-first navigation. Preserve meaningful content when cropped and when the website places a title near the bottom.
2. Entity contact shadows: propose a matched on/off pair with the same camera, entity pose, scene, and lighting. Toggle only the entity contact-shadow/AO system, keeping world AO and all other shadow settings unchanged. Choose a character or prop over a surface where the grounding effect is easy to see; confirm the exact setting from the selected build. The website can show two ordinary stills in the existing gallery.
3. A representative gameplay scene near a map transition, using a suitable existing save/demo if repeatable. Evaluate the existing linked gameplay video for an uninterrupted level crossing with audio; provide a verified timestamp if suitable. A still cannot demonstrate transition continuity. Video remains an external link on the website.
4. Optionally, the game picker for interface context. Do not stage unavailable or unsupported installed games/expansions.

The public `doc/media/menu-tour.gif` is 640×360 and its opening frame has a visible version watermark, so use it as a composition reference. Inspect `menu-tours/menu-tour.txt`, the referenced capture tooling, and `demos/` before proposing exact capture steps. Confirm overlay suppression against actual output. Keep the normal gameplay HUD where appropriate; remove notifications, personal information, console messages, debug overlays, and any unintentional version watermark. Do not upscale or generate fictional game imagery.

For each proposed image, return its purpose, supported platform, exact release/commit, scene/save/demo, resolution, relevant settings, reproduction/capture steps, and a suggested caption and alt text. Describe any small text or edge content that must survive the website's thumbnail crop. Identify reusable existing assets with their original source/capture author, game/version, and any reuse conditions. If a comparison would help, use identical camera/scene conditions and identify the one changed setting.

Also return factual notes for the article:

- Build on the confirmed motivation and feature emphasis above. Ask for any useful concrete examples or development experiences the repository cannot establish.
- The important implementation decisions in Continuum's own work, distinguished from Valve's game and the upstream Xash3D-FWGS engine. Discuss resident world models, in-memory transition state, audio continuity, and the unified controller-first interface where accurate. Avoid unsupported performance claims or saying transitions have literally no pause.
- Preserve the confirmed division of work above. If useful, propose a documented example of how engine-state inspection, simulated input, or demo playback helped refine a feature; verify it from project records rather than inventing an anecdote. Fable and Opus are confirmed; do not add a model version or a Codex role.
- Actual implementation languages and useful project tags, using the related forks as evidence rather than just the umbrella's language totals.
- Keep my confirmed **June 9, 2026** start date. The portfolio session verified the [first visible streaming engine change](https://github.com/bishopdynamics/xash3d-fwgs/commit/42e54c9106e4843caa0c64d2800a2ac6d20ff909) on June 11 and [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0) publication on June 22. The public commits capture work already underway. Confirm the intended completion endpoint; using the initial release yields 13 calendar days. Exclude inherited upstream history and keep subsequent maintenance distinct.
- A concise description and story outline. Link to the release and original-game-data requirements for people who want to try it.

Return the capture plan and evidence first, highlighting anything that requires my account or review. Do not publish, alter website content, or treat the plan as approved. Once we agree on captures, preserve the original files and provide a manifest of filenames, dimensions, captions/alt text, sources, and settings for the portfolio session.
