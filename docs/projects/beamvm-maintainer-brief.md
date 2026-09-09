# BeamVM portfolio preparation brief

Copy this prompt to the BeamVM maintainer session when ready. It requests factual review and a capture plan first; it has not been sent automatically.

---

We are preparing **BeamVM** as the next project on whatclaudemade.com. The website's design and project/article/gallery presentation are already established. Help us prepare an accurate story, a landscape cover, and a few images or short animations demonstrating the current product.

My motivation and the project's progression are now established: a game about making games for a VM under shared CRT-drawing/logic time constraints; deliberately flawed games to fix as learning/test cases; then a launcher and minimal Unix-like shell. The DOOM challenge led me to invent the Pro hardware's asynchronous graphics coprocessor. The first two shareware maps were reduced to the needed data and sprites converted to outlines, producing a playable adaptation with substantial compromises. **Only those first two shareware maps were tested.** Full DOOM/DOOM II campaign conversion remains theoretical. Preserve that distinction and do not repeat the motivation intake questions.

First establish the exact version/revision that should represent BeamVM. The portfolio session inspected the accepted debugger/IDE/shell/DOOM work around `3927dda`, and the checkout advanced to `c48ddab` during intake. Coordinate with the current work rather than capturing an accidental mixture of unfinished changes.

The local README still presents M0/M1 and lists M2 as upcoming, so it needs review against the current implemented debugger, IDE, filesystem, launcher, shell/editor, and DOOM content. Identify the canonical public repository and download links: the configured remote requires sign-in, and the portfolio session found no public release URL. Do not assume a public mirror or publish a repository/release as part of this prompt; prepare the concrete cleanup/release steps for review.

For media, discuss a small set of these candidates with me before capturing:

1. A landscape overview combining the glowing CRT result with the editor/debugger, suitable for a 16:9 card crop.
2. A reproducible time-travel debugging scene with timeline, source position, state/watch information, and an understandable program. Evaluate the bundled `pilot.bvmt` trace if useful.
3. A DOOM E1M1/E1M2 scene that shows the actual machine's rendering and controls; characterize what is implemented accurately.
4. The shell launching the editor or another DSL program, or the launcher as a clear introduction to available programs.

The existing 1024×1024 phosphor-rendered Lissajous icon is a useful visual reference, but a landscape product capture may make a stronger cover. Preserve native-resolution originals, preferably at least 1920×1080 for a full-screen view, with readable UI and no private paths, notifications, diagnostic overlays, or unrelated windows. Do not generate or reconstruct screenshots.

For each proposed capture, return its purpose, exact revision/build/platform, program/trace/save state, resolution, reproduction steps, caption, and meaningful alt text. Explain what must remain visible in a thumbnail crop. Identify existing capture capabilities and any preparation needed; the portfolio session did not find a general tracked capture exporter. If proposing animation, show actual execution/debugger behavior and preserve the original timing.

Also help establish the actual project start before the August 25 core import, the intended completion milestone, implementation languages (Rust and any relevant DSL/WGSL contributions), and how the human and agents divided research, design, implementation, and review. Ask me for attribution where source cannot establish it; the motivation is already supplied above. Keep upstream technologies and game assets distinct from BeamVM's own work.

Return the evidence and capture plan for discussion first. Website copy, final images, and publication will be reviewed separately.
