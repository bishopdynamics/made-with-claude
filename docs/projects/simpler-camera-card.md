# Simpler Camera Card draft evidence

Status: text draft prepared in the parallel Astra batch; final user review pending. Entry: `src/content/projects/simpler-camera-card.md`.

## Source and scope

- Source snapshot: `e2db0968908647ca46cf0ba28b67af0596e1d23c`, clean sibling checkout. Reviewed reliability watchdog/supervisor/retry, card/snapshot/endpoint/editor, MSE player, changelog, attribution, and accepted iOS spec.
- [Public repository](https://github.com/bishopdynamics/simpler-camera-card), raw README and prebuilt bundle were verified anonymously. Public package is 0.7.1; local metadata is 0.7.2. The draft does not claim a 0.7.2 or 1.0 public release.
- Describes frozen-frame detection, bounded recovery behavior, signed connections, snapshot/tap-to-live modes, visual editing and MSE/ManagedMediaSource compatibility. No universal reliability or competitive claims, no live camera/HA access.
- Language: TypeScript; tags Home Assistant, Cameras.
- Candidate implementation milestone dates: August 15–28, 2026. Start evidence `fe1812da9922830494866936de4c6779f1807686`; endpoint is accepted iOS/live work and review sign-off in `FEATURE_SPEC_ios_live.md`/`RELEASE_PLAN_1.0.md`, including `4012e63aba7be3a3ed3f7053b0847f7ce8b11fba`. Final v1.0 walkthrough/release remains pending. User should review these candidate dates.

## Images needed

No image assets were found, including a hidden-file image search. Cover and product screenshots are needed.

Suggested captures: a real card with a safe demonstration scene, its reconnect state, and optionally the editor or tap-to-live countdown. Exclude private camera subjects, account details, camera identifiers and device addresses.

## Verification

Astra/high worker committed `7513067`; format/whitespace and privacy checks passed. Parent reviewed/integrated the article and reran formatting/privacy (258 snapshots, zero findings). Worktree/branch safely removed. Final batch verification passed; see [the batch review](batch-draft-review.md).
