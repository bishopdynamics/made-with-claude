# Evergreen Handoff

Durable handoff info — the kind of stuff that should be read at the start of every session, regardless of what the last session did. Keep entries current; delete them when they stop being true.

## Evergreen Entries

- Project: Hephaestion; public site: `madewithclaude.com`. A polished portfolio/blog showcasing the user's software projects built with Claude. Source of requirements: `docs/idea/initial-idea.md`.
- The user wants GitHub-based hosting and CI publication, with DNS managed in Amazon Route 53 and no self-hosted public infrastructure. This overrides the template's GitLab assumption.
- Rapid local iteration must work without committing or pushing. Pushing to the publishing branch is the final publication step. Pre-commit screening must cover secrets, sensitive files, and personal information.
- Add projects individually with the user: cleanup, screenshot capture, and a blog entry. Prepare a reusable prompt for each project's maintainer LLM to discuss suitable screenshots.
- Initial candidates listed as ready: Half-Life: Continuum edition, Vintage, matrix-screensaver, capture-view. Almost ready: BeamVM, VintageVault. Most target Linux and macOS. Listed readiness does not mean screenshots or writing are already prepared.
- Approved foundation (2026-09-07): static Astro, Markdown content, TypeScript site code, npm with a lockfile, and GitHub Pages via GitHub Actions. Use the standard Astro `src/` layout recorded in `PROJECT.md`.
- GitHub remote: `github`, pointing to `bishopdynamics/made-with-claude`. The user created it as a fresh private repository; initial remote access was verified. Keep `.bishop/` committed per the user's explicit instruction; scan its contents without treating the folder itself as sensitive.
- The repository and project Codex safety-hook definition have recorded trust. The hook matches the trusted template definition, and its guard was verified with synthetic inputs. Do not modify template-owned hook files.
- Development: Node version in `.nvmrc`, npm lockfile, `make setup`, `make run`, `make check`. Git hook lives at `.githooks/pre-commit`; setup installs it. See `docs/development.md` for screening limits and upgrade considerations (TypeScript checker compatibility, foreground Astro API wrapper, direct Secretlint rule registration).
- `archive_1.md` contains handoff history inherited from project-template-a. It describes work on the template and other repositories, not Hephaestion; do not resume its next-session instructions here.
