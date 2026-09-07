# Hephaestion

A polished portfolio and blog for **madewithclaude.com**, showcasing software projects built with Claude.

Projects will be added individually, with carefully prepared screenshots and a blog entry explaining each project. The site should emphasize beautiful, simple visual design.

## Local development

Use Node.js from `.nvmrc`, npm, Git, and Make. The development workflow supports Linux and macOS.

```sh
make setup
make run
```

Open the local URL printed by Astro. Changes appear during local development without committing or pushing.

```sh
make check         # Formatting, types, safeguard tests, privacy screening, build
make build         # Generate the static site in dist/
npm run preview    # Inspect the production build locally
make help          # List development commands
```

`make setup` installs the locked npm dependencies and the Git pre-commit hook. The hook scans the contents staged for commit for credentials, sensitive files, and recognizable personal information. `.bishop/` is intentionally version-controlled and is scanned with the other files. Automated checks cannot recognize every kind of private information; review screenshots, image metadata, and prose before publication.

## Project status

The approved foundation is Astro with TypeScript and Markdown. First-run setup is complete, with development tools and a minimal homepage; final design and individual project entries follow in Initial Planning.

The private GitHub repository is `bishopdynamics/made-with-claude`, using the remote named `github`. The current Actions workflow checks changes without deploying a website. GitHub Pages publication and the Route 53 domain connection will be configured for launch; pushing to the publishing branch will then publish the site.

See [the initial idea](docs/idea/initial-idea.md), [project rules](PROJECT.md), and [task queue](docs/TASK_QUEUE.md).
