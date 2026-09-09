# Vintage Vault draft evidence

Status: draft and three screenshots prepared in the parallel Astra batch; final user review pending. Entry: `src/content/projects/vintage-vault.md`.

## Source and scope

- Source snapshot: `27edfe7df7d91cbd093f02011b1e76e42c0a370f`, clean sibling `vintage-vault` checkout. No source changes or app execution occurred.
- Evidence: amended `DECISIONS.md`, `IDEA.md`, Go app/update/validation and launch/store/client/transfer implementations, and Svelte App/Wizard.
- The draft explains editable workspaces, sealed content-addressed bottles, writable overlays, validation/repair, library/client workflows, and Linux/Steam Deck targets. Current Windows launch is Proton-only; native Linux launch is separate. Plain Wine import does not mean a supported plain-Wine launch backend.
- Avoided stale README claims about cross-machine hash reproducibility and Gaming Mode editing restrictions. Languages: Go, JavaScript, CSS; tags Games, Compatibility, Self-hosted.
- Dates remain pending: May 30, 2026 starts project-specific history, but current scope has no unambiguous original completion boundary. No public source/release URL was verified; internal addresses are omitted. No personal/model attribution is invented.

## Selected media

All are unchanged 1920×1106 repository JPEG screenshots, inspected by worker and parent:

| Local asset | Source | SHA-256 |
| --- | --- | --- |
| `library.jpg` (cover) | `screenshots/Library.jpg`, media revision `1620d9dde8bfd71a8df55c54f8f712d1c954498c` | `eefe785f494152f9e475b2728620de2032304a0059b69badf7522927ac1535b8` |
| `create.jpg` | `screenshots/Create.jpg`, same media revision | `67d7118bb3855eb5184ea02e787b8f0fd76973685e04b855fa109c75ba7e5fd1` |
| `tasks.jpg` | `screenshots/Tasks.jpg`, media revision `e1dac1ad8247a3f4cc7c9aee40743de444344775` | `b3e1f103ef2049b1f2d55ec020ed642f633c4e93688c304dfae51c132b58c6ee` |

The screenshots contain game artwork as part of the product UI; no separate media license was found in the source root. The Storage screenshot was omitted because it exposed local paths. Cover and product screenshot needs are met for this draft; a current full-screen Steam Deck view is an optional later improvement.

## Verification

Astra/high worker committed `7356331`; format/whitespace, source hashes, and privacy checks passed. Parent reviewed all three images and the article, integrated the commit, and reran format/privacy checks (256 snapshots, zero findings). Worktree/branch safely removed. Final batch browser/build review passed; see [the batch review](batch-draft-review.md).
