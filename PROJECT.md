# Project: Hephaestion

A polished portfolio and blog for `madewithclaude.com`, showcasing software projects built with Claude and/or Codex under the guidance of BishopDynamics.

This file is **project-owned**: template migrations never touch it. It holds everything about *this* project that agents must know beyond the shared rules in `AGENTS.md`. Where the two conflict, this file wins.

## Project-specific rules

- The public site is `madewithclaude.com`; Hephaestion is the project name.
- Use GitHub for the repository and hosting workflow, overriding the template's GitLab first-run step. The user manages the domain through Amazon Route 53 and wants no self-hosted public infrastructure.
- The repository is `bishopdynamics/made-with-claude`, public as of 2026-09-07, on the remote named `github`.
- `.bishop/` belongs in version control. Include its contents in secret/privacy screening, but do not ignore or reject the folder itself.
- Local preview and validation must work without pushing. Treat a push to the configured publishing branch as publication.
- Include pre-commit screening for secrets, sensitive files, and personal information in the initial tooling plan.
- Add projects one at a time with the user, including project cleanup, screenshots, and a blog entry. Do not assume listed projects already have publishable assets or copy.
- Prioritize polished, simple visual design. Featured software primarily targets Linux and macOS.
- Approved foundation: a static Astro site, TypeScript for site code, Markdown content, and GitHub Pages published through GitHub Actions. Use npm with a committed lockfile.
- Repository layout: `src/pages/` for routes, `src/layouts/` and `src/components/` for presentation, `src/content/` for Markdown, `src/assets/` for source images, `public/` for files copied as-is, and `scripts/` for development checks.
- Approved visual direction (2026-09-07): black/charcoal surfaces, warm-gray text, muted amber accents, Inter for interface/prose, and JetBrains Mono for code. Homepage title: `What Claude/Codex Made`. The draft `docs/spec/ROOT_SPEC.md` records page layouts, content rules, and the implementation plan; full-spec approval is still pending.
- First run is complete. The current GitHub workflow checks changes; deployment will be added as part of the launch implementation. The first project is Half-Life: Continuum Edition (<https://github.com/bishopdynamics/Continuum>); review its copy, images, and development dates with the user during onboarding.
