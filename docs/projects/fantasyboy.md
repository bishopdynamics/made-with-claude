# FantasyBoy onboarding

Status: intake in progress, 2026-09-08. The user selected FantasyBoy next, described it as their oldest project, and supplied its parent directory. Workflow: [FantasyBoy onboarding spec](../spec/FEATURE_SPEC_fantasyboy_onboarding.md).

## Source context

- Located the sibling `FantasyBoy` checkout. It is receiving template setup independently; this portfolio session reads it without modifying or initializing it.
- The README and project notes describe a Python fantasy console with a custom 6502-style CPU, a 256×200 RGB332 display, sprites, a minimal C-subset compiler, and an emulator debugging interface.
- Sample games: Breakout, Keen (a side-scrolling platformer), and Tetris.
- Debugging tools include CPU controls/stepping, registers/stack/memory inspection, bytecode disassembly and breakpoints, working/display buffers, and sprite inspection.
- The compiler supports compile-time evaluation for graphics data embedded in ROMs. Detailed instruction/format/performance claims need precise source evidence if the article uses them; avoid carrying README speedup figures into the portfolio without measurement.
- Public source: <https://github.com/bishopdynamics/FantasyBoy>. Anonymous GitHub API access independently confirmed a public, MIT-licensed repository with `main` as the default branch.
- Product evidence is pinned to [`5fc9ad2991e674ac75ba286639604bb45356fe90`](https://github.com/bishopdynamics/FantasyBoy/commit/5fc9ad2991e674ac75ba286639604bb45356fe90), the committed source snapshot preceding the independently active template initialization. The worker inspected tracked content at that revision rather than mixing uncommitted migration changes into product claims.

## Implementation evidence

- Python emulator/runtime: `src/emulator/{cpu,cpu_jit,memory,display,gui,debugger,code_panel}.py`. The worker verified the optional Numba execution path, memory/display layout, CPU controls, breakpoints, disassembly, buffers, and sprite viewer.
- Python compiler: `src/compiler/{lexer,parser,ast_nodes,codegen,compile_eval,linker,stdlib}.py`. It implements the documented C subset, includes/preprocessing, bytecode generation/relocation, compile-time graphics evaluation, and ROM output.
- C-subset sample games: `projects/breakout`, `projects/keen`, and `projects/tetris`, each organized as a multi-file program. Python and C are plausible portfolio language labels; record that the games use the console's subset compiler rather than claiming full C compatibility.
- The historical initial prompts describe a smaller 128×128 machine with one Breakout sample. The committed result has a 256×200 display, sprite memory and compile-time asset generation, and three sample games. This is a possible story thread if the user confirms how that evolution happened.

This session did not build or play the app. Source inspection and existing captures support intake, not independently reproduced runtime/performance claims.

## User story

The user calls FantasyBoy their oldest project. They have been asked what inspired it, what they are proudest of, and how they worked with Claude. Do not assume it was their first-ever AI project or copy the later projects' motivation/workflow.

The README credits Claude with generating the emulator, compiler, games, and docs through iterative prompting. The original prompt names Claude Sonnet 4.5 as the intended implementation model. Its contribution rule also requires Sonnet 4.5 or newer; neither a contribution policy nor an intended-model prompt proves the model used for every part. Confirm exact attribution and the user's role through their account.

## Existing media

The orchestrator inspected all three existing PNG screenshots:

| File in source checkout | Dimensions | Bytes | Visible subject |
| --- | --- | --- | --- |
| `screenshots/breakout.png` | 1424×968 | 266,969 | Breakout game display with virtual controls, CPU/memory/buffer panels, disassembly, and sprites. |
| `screenshots/keen.png` | 1424×968 | 267,908 | Platformer scene beside the same debugging tools and sprite viewer. |
| `screenshots/tetris.png` | 1424×968 | 273,916 | Tetris board and next-piece display beside registers, disassembly, buffers, and sprites. |

These are useful gallery candidates because they show both a game and the fictional machine's tools. A cover should keep the chosen game's display identifiable at card size; the full gallery image should preserve the entire window. Captions should identify the emulator/game and visible tools without claiming the screenshots prove runtime behavior. No images have been copied into site content or approved yet.

Proposed first-pass order for discussion: Keen as the cover, Tetris as the familiar game example, then Breakout for the debugger/machine detail. Preserve the full original screenshots in the gallery; final cover cropping and captions remain for user review. No new capture is required merely to begin that discussion.

## Dates and publication

- The public repository currently has one product commit, `5fc9ad2`, titled `initial, version 1.0.0`, with timestamp **2026-02-17T11:46:43-08:00** (19:46:43 UTC), independently verified by the orchestrator. Repository creation is minutes earlier that day. This is an import/publication point, not proof of a one-day development period.
- `VERSION` contains `1.0.0`, but the [GitHub releases page](https://github.com/bishopdynamics/FantasyBoy/releases) has no releases according to the independently checked API. Use the source repository as the current way to obtain it; do not invent a release/download URL.
- Actual ideation/start and completion dates need the user's account or earlier records. Do not infer dates from the copyright year or the current template migration.
- Dates, taxonomy, and the final endpoint remain unset until reviewed; no site entry has been created yet.

## Review record

- 2026-09-08 — User selected FantasyBoy after pausing BeamVM for images. Source and three existing screenshots located and inspected; story question pending.
- Read-only evidence work completed. Parent independently verified public repository/license/release state and the initial commit timestamp, and visually inspected all three screenshots. No source files, runtime state, dependencies, or Git state were changed in FantasyBoy.
