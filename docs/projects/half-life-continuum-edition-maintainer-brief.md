# Continuum portfolio capture and story brief

Copy the following prompt into the Half-Life: Continuum Edition maintainer session. It requests a plan and factual notes first. Review the scenes together before making captures.

---

We are preparing **Half-Life: Continuum Edition** as the first project on **madewithclaude.com**, a portfolio of projects made with Claude and/or Codex under the guidance of BishopDynamics. The canonical source is <https://github.com/bishopdynamics/Continuum>.

Inspect the current public release, existing media, and the engine/menu/SDK forks, then propose a small, reproducible screenshot set for discussion with me. The website needs a 16:9 cover and a few supporting still images, with uncropped high-resolution originals available in its full-image gallery. Prefer native 1920×1080 or higher where the output stays representative and readable.

Start by evaluating these candidates:

1. The root menu as a cover: Continuum title, orange artwork, visible controller-first navigation. Preserve meaningful content when cropped and when the website places a title near the bottom.
2. The game picker: show how the same interface handles installed games/expansions. Do not stage unavailable or unsupported content.
3. A representative gameplay scene, optionally showing a particularly successful visual addition. Use a suitable existing save or demo if repeatable. Record any nondefault settings; do not suggest a still proves seamless level transitions.

The public `doc/media/menu-tour.gif` is 640×360 and its opening frame has a visible version watermark, so use it as a composition reference. Inspect `menu-tours/menu-tour.txt`, the referenced capture tooling, and `demos/` before proposing exact capture steps. Confirm overlay suppression against actual output. Keep the normal gameplay HUD where appropriate; remove notifications, personal information, console messages, debug overlays, and any unintentional version watermark. Do not upscale or generate fictional game imagery.

For each proposed image, return its purpose, supported platform, exact release/commit, scene/save/demo, resolution, relevant settings, reproduction/capture steps, and a suggested caption and alt text. Describe any small text or edge content that must survive the website's thumbnail crop. Identify reusable existing assets with their original source/capture author, game/version, and any reuse conditions. If a comparison would help, use identical camera/scene conditions and identify the one changed setting.

Also return factual notes for the article:

- What problem motivated Continuum, who it is for, and the result I most want to showcase; ask me where the repository cannot answer.
- The important implementation decisions in Continuum's own work, distinguished from Valve's game and the upstream Xash3D-FWGS engine. Discuss resident world models, in-memory transition state, audio continuity, and the unified controller-first interface where accurate. Avoid unsupported performance claims or saying transitions have literally no pause.
- How Claude and/or Codex were used and what I directed, reviewed, tested, or changed. Confirm exact model attribution with me rather than inferring it from a commit trailer.
- Actual implementation languages and useful project tags, using the related forks as evidence rather than just the umbrella's language totals.
- Candidate first project-specific work and completion/release dates, with public commit/release URLs and timezone notes. Exclude inherited upstream history and separate later maintenance. The portfolio session verified the [first visible streaming engine change](https://github.com/bishopdynamics/xash3d-fwgs/commit/42e54c9106e4843caa0c64d2800a2ac6d20ff909) on June 11, 2026 and [v1.0.0.0](https://github.com/bishopdynamics/Continuum/releases/tag/v1.0.0.0) publication on June 22, 2026, an 11-day calendar span. Confirm whether there was earlier local work or a different intended completion point.
- A concise description and story outline. Link to the release and original-game-data requirements for people who want to try it.

Return the capture plan and evidence first, highlighting anything that requires my account or review. Do not publish, alter website content, or treat the plan as approved. Once we agree on captures, preserve the original files and provide a manifest of filenames, dimensions, captions/alt text, sources, and settings for the portfolio session.
