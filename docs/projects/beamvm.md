# BeamVM onboarding

Status: **write-up approved; metadata/media integration resumed**, 2026-09-08. The user supplied `docs/SCREENSHOTS.md` and its images, requested metadata in drafts, and confirmed the development period. Preserve the approved article while adding source information and images. Workflow: [BeamVM onboarding spec](../spec/FEATURE_SPEC_beamvm_onboarding.md).

## Starting context

- Read-only source checkout: the sibling `beamvm` project.
- Its `PROJECT.md` describes a programming game where a Python-flavored DSL steers a simulated vector CRT, played inside a time-travel debugger.
- The local README describes Rust core/app crates and early M0/M1 work. It has not kept pace with later source/specs, so it is an orientation aid rather than the basis for current-feature claims.
- Evidence worker inspected commit `3927dda` (2026-09-08, acceptance of cheats). During the orchestrator's follow-up the independently active source checkout advanced to `c48ddab`, a keyboard-capture implementation commit. Treat this as an advancing development checkout, not an immutable release snapshot; choose the capture/release revision with the maintainer. This onboarding session made no changes there.
- The article is at `src/content/projects/beamvm.md`, still `draft: true`, with source-backed languages/tags, confirmed dates, and six images ready for review. Public source/download links and specific attribution remain unresolved.

## Source and release readiness

The configured source repository requires sign-in. Both the worker and orchestrator verified that an anonymous request reaches a sign-in page; no public release/download link has been established. Do not expose the internal remote URL in portfolio content or invent a GitHub mirror. The user has been asked which public URL to use, or whether public release preparation is still needed.

The source has packaging targets for a portable Unix binary and macOS app/DMG, and crate versions `0.1.0`; these do not establish that a downloadable public release exists. A README refresh and a chosen public source/release destination may be needed in the BeamVM project. Prepare that work with its maintainer rather than changing an independently active checkout from this portfolio session.

## Current capabilities and article outline candidates

Evidence below is from the local source, not from the stale README's “Next” list:

- **A programmable vector display:** a deterministic Rust core compiles a Python-flavored DSL into bytecode. Drawing and computation consume simulated cycles, with a phosphor CRT renderer in the desktop app. Sources: `beamvm-core/src/{lexer,parser,compiler,bytecode,vm}.rs`, workspace Cargo manifests, and `beamvm-app/src/phosphor.rs`.
- **A debugger built around time:** snapshots/restore, scrubbing and reconstruction, backward stepping, branching, traces, and multiple breakpoint kinds are implemented. Sources: `beamvm-app/src/{driver,debug}.rs`, `beamvm-core/tests/m2_core.rs`, and the accepted M2 debugger spec.
- **An integrated programming environment:** editable source, diagnostics/completion, state inspection and source/CRT links; examples and a bundled program library. Sources: `beamvm-app/src/{editor,intel,ui_source,library}.rs` and the accepted M3b IDE spec.
- **Programs that demonstrate the machine:** launcher, Unix-style shell, nano-like editor, deterministic filesystem operations, and DOOM E1M1/E1M2 content with rendering/combat/menu/cheat work. Sources: the program registry in `beamvm-app/src/library.rs`, `examples/*.bvm`, `examples/include/doom_*.bvi`, related content tests and accepted feature specs. Describe the actual implementation accurately; do not call it a full general-purpose OS or a complete DOOM port without review.

The orchestrator independently inspected the current program registry and confirmed its launcher/shell/editor and E1M1 entries. The worker inspected the broader implementation and accepted-spec evidence. No application build, runtime verification, or screenshot capture was performed during this intake.

## User story

Confirmed firsthand account from the user on 2026-09-08:

- They wanted to create a video game using a virtual machine, and made it a game about creating games under specific restrictions.
- Their interest in CRT technology and vector displays led to a machine where programs must balance time spent drawing against time spent on game logic.
- A series of games with specific problems to solve helps players get started and provides useful test cases.
- The scope then expanded to a launcher and a minimal Unix-like shell.
- The user asked whether it could run DOOM; the original machine could not. They then designed a fictional **Pro** hardware variant with a graphics coprocessor that can execute dispatched drawing work asynchronously from main-CPU logic.
- The first two shareware maps were reduced to the needed data, and sprites were preprocessed into outlines the renderer could draw. The result is playable and derived from original content, with significant compromises to fit the machine.
- **Only the first two shareware maps were tested.** Full DOOM and DOOM II campaign conversion is a theoretical pipeline capability, not validated coverage. Preserve this qualification in prose, descriptions, and media captions.

The first-person draft follows that progression, from constrained game-making to the Pro hardware challenge, with the verified editor/time-travel debugger providing context. It avoids asserting that modern displays have no possible analogue; the user's interest in vector CRTs can be expressed without an absolute technical claim.

BeamVM-specific model attribution and the detailed human/agent division of work remain unconfirmed. Do not reuse Continuum's Fable/Opus attribution or sole-research/implementation statement as BeamVM facts. Dates are now confirmed; public URLs and final assembled-media acceptance remain separate review inputs.

## Media and metadata

The user supplied `docs/SCREENSHOTS.md` with deterministic app-window captures. The source checkout was at revision `1fc21b1fda5fa7809863b57ab9730217d2861dab`, but the supplied guide and `docs/images/` were untracked at inspection; that commit is context, not an image-content reference. The orchestrator inspected six 1200×860 PNGs and independently compared the local copies with the user-supplied working files. The guide records screenshot mode at display scale 1×, reproducible with `make screenshots`. This session does not execute capture commands or alter the source checkout.

| Gallery ID / source file under `docs/images/` | Selected purpose and scenario |
| --- | --- |
| `rockfield` / `program_rockfield.png` | Initial cover: functioning vector game with Source and cycle-budget tools; `--builtin rockfield --tab source`. |
| `rockfield-dim` / `program_rockfield_dim.png` | Repair exercise and problem brief; `--builtin rockfield_dim`. Caption describes the exercise, not a measured brightness comparison. |
| `time-travel` / `debugger_timetravel.png` | Replay/Branch controls and past machine state; `--builtin splitstorm --pause --scrub 1.5 --tab state,source`. |
| `shell` / `program_shell.png` | Virtual filesystem program listing; shell scenario with `ls -l` as documented in the source guide. |
| `pro-coprocessor` / `debugger_avg.png` | Pro display-list inspection; `--builtin marquee --pro --tab avg,meters`. |
| `doom` / `doom_play.png` | First shareware map after menu input, walking and turning; six-second E1M1 Pro scenario from the guide. |

Files are copied unchanged to `src/assets/projects/beamvm/`. Full windows remain available in the enlarged gallery. Rockfield is the initial cover for review; approved body copy is preserved.

SHA-256 provenance for the supplied files: `program_rockfield.png` = `9bf41d3916c303500337a76adc9216e9280ddb6bf6ff251b82061971707d3816`; `program_rockfield_dim.png` = `8dcada1c061cdc45d4ef1da9523907137fbd9e474466d020e7e879bf424ff98d`; `debugger_timetravel.png` = `ac4b6e7491629ba7d00b0d9e4f541616e7913231f596efeaae04b12cf98a9d24`; `program_shell.png` = `2986a97e6e9b8d34409ffb79cc2cba7e93a10a9cf2d77a2fc60f6bd594671741`; `debugger_avg.png` = `b3c768cb47f8117f5562a3cf04e7126df1102116299a7a0970ba0728bf14e4e4`; `doom_play.png` = `493fdd46964ecbe5660a2f8e7cd3e6895e459b228c5929d4de3f204d0b480607`.

- Existing icon: `beamvm-app/assets/icon.png`, 1024×1024 RGBA. The orchestrator visually inspected the glowing green Lissajous pattern on the simulated CRT. It is rendered through the app's phosphor pipeline via the developer `render_icon` test, according to source inspection. It may help introduce the visual direction; a landscape runtime capture would show more of the product than a square icon crop.
- The earlier lack of tracked capture tooling is superseded by the user-supplied guide, `docs/screenshots.sh`, app screenshot mode, and new image set. The earlier icon remains a reference; the Rockfield screenshot is now the draft cover.
- The selected stills follow the user's story through a working game, repair exercise, debugger, shell, Pro coprocessor, and DOOM. Additional launcher/editor or animated captures can be considered later; the current six-image set is ready for review.
- Draft languages: **Rust, BeamVM DSL, WGSL**, covering the core/app, machine programs, and renderer shaders. The DSL is Python-flavored, not Python. Draft tags: **Games, Graphics, Developer tools**.
- **Confirmed development dates: August 25–September 8, 2026.** The user says the earlier pre-import work was planning earlier on August 25 itself. Store `startedOn: '2026-08-25'`, `completedOn: '2026-09-08'`; the existing helper displays **2 weeks** of elapsed calendar time. Later source work does not silently move this reviewed endpoint.

An optional [maintainer brief](beamvm-maintainer-brief.md) captures these source/media questions for the BeamVM project without sending a message externally.

## Review record

- 2026-09-08 — User explicitly selected BeamVM next and described it as ready.
- Read-only source/evidence research completed; no files changed in BeamVM. Public source/download question remains pending.
- 2026-09-08 — User supplied the constrained game-making premise, repair-game learning path, launcher/shell expansion, and Pro hardware/DOOM progression. Prepared an incomplete article with explicit two-map tested scope; exact model/workflow attribution remains for review.
- 2026-09-08 — User approved the write-up and is preparing images. Onboarding is paused at their request until those images arrive. Public links, dates, attribution, and final media/publication review remain for resumption; they are not requests to continue working on the paused draft now.
- 2026-09-08 — User supplied the completed screenshot guide and requested draft metadata, resuming that work. They confirmed August 25–September 8 as the development period, including earlier planning on August 25. Approved Markdown body remains unchanged; six inspected images and source-backed labels are integrated for review.
- Parent verification: `make check` passed 43 tests, zero Astro diagnostics and privacy findings across 236 snapshots. Both draft cards/detail pages show languages, tags, and calculated development spans; pending labels were also observed with missing draft metadata before the content refresh. Browser checks at desktop/mobile confirmed no overflow, six loaded BeamVM thumbnails, original 1200×860 images in the viewer, and correct last-image navigation state. Public search records remain Continuum-only; the production build excludes both drafts and pending labels. Logs/screenshots: `.agent-worktrees/_runs/beamvm-onboarding/`. Temporary review server/browser were stopped; existing preview on 4321 remains running with refreshed content.
- Parent verification passed `make check`: 43 tests, zero Astro diagnostics and privacy findings. The four-page production build uses `whatclaudemade.com` canonical/social URLs, retains Continuum, and excludes BeamVM. Local browser review confirmed the BeamVM draft/noindex marker, corrected header/canonical, explicit tested-scope qualification, and no horizontal overflow at desktop/mobile widths. The pre-existing preview needed a content refresh after the config change and now serves `/projects/beamvm/` on port 4321. Temporary diagnostic preview/browser were cleaned up; screenshots/log are under `.agent-worktrees/_runs/beamvm-onboarding/`.
