# FantasyBoy onboarding

Status: first story/media draft prepared and locally verified, 2026-09-08. The user confirmed FantasyBoy was their first project with Claude and supplied its motivation, original model uncertainty, and later review/migration history. Workflow: [FantasyBoy onboarding spec](../spec/FEATURE_SPEC_fantasyboy_onboarding.md).

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

Confirmed firsthand account from the user:

- FantasyBoy was their **first project with Claude**, while evaluating whether AI tools could deliver substantial work.
- They wanted to build an emulator for a simple CPU and chose the 6502 as inspiration. The idea became a fictional Game Boy-like console with a full debugging emulator and example games for testing/validation.
- They remember doing the original project with **Sonnet**, possibly with a little Opus involvement, but are uncertain. They were still learning the available models and had not yet developed a workflow for LLM projects, context, or memory.
- The result convinced them the tools had become capable of useful project work.
- **Fable and Astra reviewed it much later**, and the project was migrated to the user's modern process template. Keep this later maintenance separate from original implementation and development duration.

The original user's CPU association needs a factual correction: the real Game Boy's CPU uses the SM83 instruction set, not a 6502 variant ([Game Boy opcode reference](https://gbdev.io/gb-opcodes/optables/classic), [Pan Docs CPU comparison](https://gbdev.io/pandocs/CPU_Comparison_with_Z80.html)). The portfolio should present a 6502-inspired fictional console with Game Boy-like inspiration, without repeating the mistaken hardware lineage or putting an unsolicited confession into the user's voice.

The README credits Claude with generating the emulator, compiler, games, and docs through iterative prompting. The original prompt names Claude Sonnet 4.5 as the intended model, but the article uses the user's own recollection: mainly Sonnet, possible Opus uncertain. Do not add a precise version or promote uncertain Opus involvement to confirmed fact. Do not retroactively describe Fable/Astra as original implementers.

The draft is at `src/content/projects/fantasyboy.md` with the verified public repository URL and `draft: true`; no development/publication dates, taxonomy, or release URL are set. The three existing screenshots accompany it for review.

## Existing media

The orchestrator inspected all three existing PNG screenshots:

| File in source checkout | Dimensions | Bytes | Visible subject |
| --- | --- | --- | --- |
| `screenshots/breakout.png` | 1424×968 | 266,969 | Breakout game display with virtual controls, CPU/memory/buffer panels, disassembly, and sprites. |
| `screenshots/keen.png` | 1424×968 | 267,908 | Platformer scene beside the same debugging tools and sprite viewer. |
| `screenshots/tetris.png` | 1424×968 | 273,916 | Tetris board and next-piece display beside registers, disassembly, buffers, and sprites. |

These screenshots show both a game and the fictional machine's tools. The first draft copies them unchanged to `src/assets/projects/fantasyboy/` for user review, using Keen as the initial cover, then Tetris and Breakout. Captions identify the games and tools without claiming a screenshot proves execution. Enlarged gallery views preserve the entire window; final cover/caption/image approval remains pending.

First-pass order: Keen cover, Tetris as the familiar game example, then Breakout for the debugger/machine detail. No new capture or image retouching is part of this draft.

The orchestrator independently compared the local copies against the screenshot blobs at the pinned `5fc9ad2` source revision; all match byte for byte. SHA-256: Keen `6c51cde380d1f9673824da0458b0172cda8770f83d2ad40c829215807f9a4e67`; Tetris `a5601b98a017820065a35e3a80564e2ad364e397616c2901b537785ac66c4f0c`; Breakout `1cff53f517241e529f2fd55b5ff85480aa995f36b0fd32cf0493a83622ed09ab`.

## Dates and publication

- The public repository currently has one product commit, `5fc9ad2`, titled `initial, version 1.0.0`, with timestamp **2026-02-17T11:46:43-08:00** (19:46:43 UTC), independently verified by the orchestrator. Repository creation is minutes earlier that day. This is an import/publication point, not proof of a one-day development period.
- `VERSION` contains `1.0.0`, but the [GitHub releases page](https://github.com/bishopdynamics/FantasyBoy/releases) has no releases according to the independently checked API. Use the source repository as the current way to obtain it; do not invent a release/download URL.
- Actual ideation/start and completion dates need the user's account or earlier records; an approximate original-date question is pending. The user confirms recent commits reflect later Fable/Astra review and template migration, so do not use those maintenance dates as the original work's endpoint. Do not infer start dates from the copyright year.
- Dates, taxonomy, and the final endpoint remain unset in the draft until reviewed.

## Review record

- 2026-09-08 — User selected FantasyBoy after pausing BeamVM for images. Source and three existing screenshots located and inspected; story question pending.
- Read-only evidence work completed. Parent independently verified public repository/license/release state and the initial commit timestamp, and visually inspected all three screenshots. No source files, runtime state, dependencies, or Git state were changed in FantasyBoy.
- 2026-09-08 — User confirmed the first-Claude-project story, 6502-inspired fantasy-console motivation, Sonnet-led original work with uncertain Opus involvement, and much later Fable/Astra review/template migration. Prepared a first article with the existing screenshot gallery; original dates and assembled-content review remain pending.
- Parent `make check` passed 43 tests, zero Astro diagnostics, zero privacy findings across 226 snapshots, and the four-page production build. FantasyBoy and paused BeamVM remain excluded from public routes/links; Continuum remains present. Browser review confirmed the draft, three images, full 1424×968 originals with contain fitting, navigation through all three images, final Next disabled, and no desktop/mobile overflow. Logs/screenshots: `.agent-worktrees/_runs/fantasyboy-onboarding/`.
- The long-running preview initially missed the new route. A temporary fresh development server synchronized the content, after which the original port 4321 served the draft and gallery correctly. The temporary server/browser were stopped; the pre-existing preview remains running. The recurring stale-preview behavior is recorded as a tooling follow-up rather than an article blocker.
