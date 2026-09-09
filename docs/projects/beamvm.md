# BeamVM onboarding

Status: first story draft prepared and locally verified, 2026-09-08. The user selected BeamVM as the next ready project after accepting Continuum portfolio v1 and supplied its motivation and evolution. Workflow: [BeamVM onboarding spec](../spec/FEATURE_SPEC_beamvm_onboarding.md).

## Starting context

- Read-only source checkout: the sibling `beamvm` project.
- Its `PROJECT.md` describes a programming game where a Python-flavored DSL steers a simulated vector CRT, played inside a time-travel debugger.
- The local README describes Rust core/app crates and early M0/M1 work. It has not kept pace with later source/specs, so it is an orientation aid rather than the basis for current-feature claims.
- Evidence worker inspected commit `3927dda` (2026-09-08, acceptance of cheats). During the orchestrator's follow-up the independently active source checkout advanced to `c48ddab`, a keyboard-capture implementation commit. Treat this as an advancing development checkout, not an immutable release snapshot; choose the capture/release revision with the maintainer. This onboarding session made no changes there.
- The first incomplete article is at `src/content/projects/beamvm.md`, with `draft: true`. Public links, dates, taxonomy, attribution, and images remain unset while those inputs are reviewed.

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

BeamVM-specific model attribution and the detailed human/agent division of work remain unconfirmed. Do not reuse Continuum's Fable/Opus attribution or sole-research/implementation statement as BeamVM facts. Public URLs, dates, and final media remain separate review inputs.

## Media and metadata

Choose a cover that makes the vector CRT result legible at card size, then supporting views that explain the actual programming/debugging experience. The user's story makes the repair challenges and Pro/DOOM contrast especially useful media subjects. No source images, dates, taxonomy, or final copy are approved yet.

- Existing icon: `beamvm-app/assets/icon.png`, 1024×1024 RGBA. The orchestrator visually inspected the glowing green Lissajous pattern on the simulated CRT. It is rendered through the app's phosphor pipeline via the developer `render_icon` test, according to source inspection. It may help introduce the visual direction; a landscape runtime capture would show more of the product than a square icon crop.
- No tracked screenshot/GIF/video collection or general capture exporter was found. The bundled `pilot.bvmt` recording is a candidate for repeatable debugger scenes, not a verified capture workflow yet.
- Proposed scenes for discussion: CRT plus debugger/editor at a clear scrub point; a DOOM scene showing what the machine can render; the shell launching an editor/program; a clean launcher view. Select a small set after the user explains the story. A paused state may simplify reproducible stills; any animation should show actual execution.
- Implementation language candidate: Rust. The authored BeamVM DSL (`.bvm`/`.bvi`) and WGSL renderer shaders may be worth discussing, but do not label the DSL as Python or automatically add every file type to the portfolio language filter.
- Start evidence: the first repository commit is dated August 25, 2026 in Pacific time; `6f6ca5e` imports a core built earlier in a pre-template session that same date. The orchestrator independently read the import message. Ask for the actual start, since the import does not prove when the work began.
- Completion evidence: September 8 includes a recorded feature acceptance; committed implementation and local development continue around it. This is a candidate milestone, not a selected project endpoint or public release date.

An optional [maintainer brief](beamvm-maintainer-brief.md) captures these source/media questions for the BeamVM project without sending a message externally.

## Review record

- 2026-09-08 — User explicitly selected BeamVM next and described it as ready.
- Read-only source/evidence research completed; no files changed in BeamVM. Public source/download question remains pending.
- 2026-09-08 — User supplied the constrained game-making premise, repair-game learning path, launcher/shell expansion, and Pro hardware/DOOM progression. Prepared an incomplete article with explicit two-map tested scope; exact model/workflow attribution remains for review.
- Parent verification passed `make check`: 43 tests, zero Astro diagnostics and privacy findings. The four-page production build uses `whatclaudemade.com` canonical/social URLs, retains Continuum, and excludes BeamVM. Local browser review confirmed the BeamVM draft/noindex marker, corrected header/canonical, explicit tested-scope qualification, and no horizontal overflow at desktop/mobile widths. The pre-existing preview needed a content refresh after the config change and now serves `/projects/beamvm/` on port 4321. Temporary diagnostic preview/browser were cleaned up; screenshots/log are under `.agent-worktrees/_runs/beamvm-onboarding/`.
