# BeamVM onboarding

Status: intake in progress, 2026-09-08. The user selected BeamVM as the next ready project after accepting Continuum portfolio v1. Workflow: [BeamVM onboarding spec](../spec/FEATURE_SPEC_beamvm_onboarding.md).

## Starting context

- Read-only source checkout: the sibling `beamvm` project.
- Its `PROJECT.md` describes a programming game where a Python-flavored DSL steers a simulated vector CRT, played inside a time-travel debugger.
- The local README describes Rust core/app crates and early M0/M1 work. It has not kept pace with later source/specs, so it is an orientation aid rather than the basis for current-feature claims.
- Evidence worker inspected commit `3927dda` (2026-09-08, acceptance of cheats). During the orchestrator's follow-up the independently active source checkout advanced to `c48ddab`, a keyboard-capture implementation commit. Treat this as an advancing development checkout, not an immutable release snapshot; choose the capture/release revision with the maintainer. This onboarding session made no changes there.
- No BeamVM page or assets have been integrated yet.

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

The user has been asked what inspired BeamVM, which results they are proudest of, and how they and the agents built it. Those answers are pending. Do not reuse Continuum's first-person motivation or Fable/Opus-only attribution as BeamVM facts.

## Media and metadata

Choose a cover that makes the vector CRT result legible at card size, then supporting views that explain the actual programming/debugging experience. Inspect existing assets and capture tooling before proposing specific scenes. No source images, dates, taxonomy, or final copy are approved yet.

- Existing icon: `beamvm-app/assets/icon.png`, 1024×1024 RGBA. The orchestrator visually inspected the glowing green Lissajous pattern on the simulated CRT. It is rendered through the app's phosphor pipeline via the developer `render_icon` test, according to source inspection. It may help introduce the visual direction; a landscape runtime capture would show more of the product than a square icon crop.
- No tracked screenshot/GIF/video collection or general capture exporter was found. The bundled `pilot.bvmt` recording is a candidate for repeatable debugger scenes, not a verified capture workflow yet.
- Proposed scenes for discussion: CRT plus debugger/editor at a clear scrub point; a DOOM scene showing what the machine can render; the shell launching an editor/program; a clean launcher view. Select a small set after the user explains the story. A paused state may simplify reproducible stills; any animation should show actual execution.
- Implementation language candidate: Rust. The authored BeamVM DSL (`.bvm`/`.bvi`) and WGSL renderer shaders may be worth discussing, but do not label the DSL as Python or automatically add every file type to the portfolio language filter.
- Start evidence: the first repository commit is dated August 25, 2026 in Pacific time; `6f6ca5e` imports a core built earlier in a pre-template session that same date. The orchestrator independently read the import message. Ask for the actual start, since the import does not prove when the work began.
- Completion evidence: September 8 includes a recorded feature acceptance; committed implementation and local development continue around it. This is a candidate milestone, not a selected project endpoint or public release date.

An optional [maintainer brief](beamvm-maintainer-brief.md) captures these source/media questions for the BeamVM project without sending a message externally.

## Review record

- 2026-09-08 — User explicitly selected BeamVM next and described it as ready.
- Read-only source/evidence research completed; no files changed in BeamVM. User story and public source/download questions remain pending.
