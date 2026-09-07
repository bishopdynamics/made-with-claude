# Development

Hephaestion builds a static portfolio and blog for `madewithclaude.com`. The site is developed locally and will be published by GitHub Actions to GitHub Pages.

## Setup and commands

Install the Node.js version in `.nvmrc`, with npm, Git, and Make available. Run `make setup` after cloning. It installs dependencies from `package-lock.json` and configures this repository's pre-commit hook. If setup finds an existing custom hook configuration, it stops so the two can be reconciled instead of replacing it.

| Command | Purpose |
| --- | --- |
| `make help` | List commands; also the default `make` action. |
| `make setup` | Install locked dependencies and the pre-commit hook. |
| `make run` | Start the local development server; use the URL it prints. |
| `make build` | Generate the static site in `dist/`. |
| `npm run preview` | Serve the production build locally after building. |
| `make test` | Run focused tests for the development safeguards. |
| `make check` | Run the same checks required by CI. |
| `make format` | Format application and tooling files. |
| `npm run privacy:staged` | Check the exact file contents staged for commit. |
| `npm run privacy:check` | Check repository content before sharing it. |

Use the development server for rapid editing and the production preview to inspect build output before publishing. Neither operation requires a push.

## Layout

- `src/pages/`: routes, including Markdown pages.
- `src/layouts/` and `src/components/`: page shells and reusable presentation.
- `src/content/`: project and blog content as the content model is developed.
- `src/assets/`: source images processed by Astro.
- `public/`: assets copied unchanged into the build; everything here is public when deployed.
- `scripts/`: setup and repository checks.
- `.githooks/`: versioned Git hooks installed by setup.
- `.github/workflows/`: GitHub Actions checks; deployment will be added for launch.
- `.bishop/`: versioned project metadata, kept in Git by the user's explicit choice.

Create folders as their content is needed. Keep private notes, unreviewed screenshots, credentials, and exported sessions out of published content and build assets.

## Tooling decisions

Node is pinned in `.nvmrc`; direct npm dependencies are pinned and `package-lock.json` is committed. TypeScript 6 is used because the installed Astro checker does not support TypeScript 7. `.npmrc` includes development dependencies explicitly, so the site's build/check tools are installed even if the local npm default omits them.

The Astro wrappers disable telemetry. Dev and preview use Astro's documented experimental programmatic API to remain in the foreground, including in an agent environment where the Astro CLI would detach them. Keep Astro pinned and recheck startup/shutdown behavior when upgrading. Secretlint scanner rules are registered directly without its comment-suppression filter; the tests verify that suppression comments cannot hide credentials.

## Before committing

Run `make check`, review the diff, then stage the intended files. The pre-commit hook reads Git's index, which is the content that the commit will contain. Editing a secret out of the working copy alone does not remove it from the staged version; stage the corrected file too.

Secretlint detects known credential patterns. Additional checks identify sensitive filenames and recognizable personal-information patterns. Findings should report locations and rule names without echoing the private value. Fix real findings; add only narrow, reviewed exceptions for intentionally public or clearly synthetic content. A missing scanner or a scanner failure must block the hook rather than silently pass.

The scanner accepts files up to 10 MiB each and blocks larger inputs for review. Optimize large screenshots before committing them. Privacy exceptions in `.privacy-policy.json` apply to one file, one rule, and the hash of one exact line, so edits require another review; credential detection has no such exception mechanism.

Checks include tracked `.bishop` files. Ignore rules are not a reason to skip an already tracked file. Generated build/dependency files and ignored local scratch files are excluded from normal working-file discovery.

Automated checks cannot prove that a screenshot or paragraph is safe to publish. Review images for names, account details, private windows, notifications, and metadata; use prepared demo data where possible. Review prose and the complete Git history before making the source repository public. Do not commit an actual credential to test the scanner.

## Publishing

The remote is named `github`. Initial repository synchronization uses `git push -u github main`; subsequent pushes use that upstream. The bootstrap Actions workflow performs checks only, so the initial repository push does not launch a website.

The launch implementation will build only intended site content and deploy `dist/` through GitHub Pages after successful checks. Configure `madewithclaude.com` in Pages and then connect the Route 53 DNS records. The user made the source repository public on 2026-09-07, resolving the private-repository Pages plan requirement. See [GitHub's Pages prerequisites](https://docs.github.com/en/pages/getting-started-with-github-pages) and [Astro's Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).
