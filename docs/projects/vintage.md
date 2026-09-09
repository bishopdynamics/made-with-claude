# Vintage draft evidence

Status: text draft prepared in the parallel Astra batch; final user review pending. Entry: `src/content/projects/vintage.md`.

## Source and scope

- Source snapshot: `9a4bc9f9c50f0fe1183b70f56e3c03afd1666053`. A pending project-task metadata edit was excluded; source checkout was not changed.
- Evidence: current PROJECT/README, Wine backend, MIME handler, launcher generation, backup/restore, runtime/environment helpers, and GTK Settings/Launchers implementations.
- Current product is Wine-only with one shared per-user prefix, manual launcher selection, Python CLI/GTK manager, and Linux Mint 22.3 Cinnamon/Nemo as the tested target. Historical kernel-hook, Proton, and multi-prefix ideas are excluded. The draft explains the shared-prefix tradeoff and current restore protections.
- Language: Python; tags Desktop, Compatibility.
- Dates remain pending: May 29 scaffold and May 31 v0.2.1 do not bound the September hardening included in current functionality. No public repository/release URL was verified. No personal/model attribution or hands-on verification is invented.

## Images needed

No suitable project images or branding were found in the source or project-named existing image search. Cover and gallery screenshots are needed.

Suggested captures: the GTK manager's Launchers tab with representative applications, Settings with Wine selection, and optionally a Windows app alongside its chosen menu entry. Avoid personal paths and unrelated desktop content.

## Verification

Astra/high worker committed `7248f5e`; formatting, whitespace and privacy checks passed. Parent reviewed/integrated the draft and reran format/privacy screening (260 snapshots, zero findings). Worktree/branch safely removed. Final batch verification passed; see [the batch review](batch-draft-review.md).
