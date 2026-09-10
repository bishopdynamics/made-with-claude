# Website launch

Canonical site: **https://whatclaudemade.com**. Repository: [bishopdynamics/made-with-claude](https://github.com/bishopdynamics/made-with-claude). The site is hosted by GitHub Pages; Route 53 supplies DNS. No AWS compute service or AWS credentials are needed in GitHub Actions.

Launch requested September 10, 2026 with Half-Life: Continuum Edition and FantasyBoy. BeamVM is paused for its code release; the six other entries remain drafts. Status here is updated as settings, deployment, and DNS are verified.

## How publishing works

The single `.github/workflows/check.yml` checks pull requests. A push to `main` installs the locked dependencies, runs the full checks and static build, uploads only `dist/`, and deploys that checked artifact to GitHub Pages. Deployment depends on successful checks and uses the `github-pages` environment. The deploy job alone receives Pages write and OIDC permissions; no personal access token or AWS key is required. Routine local preview remains `make run`; only approved content with `draft: false` appears in the deployed artifact.

Current official action versions: checkout/setup-node v6, configure-pages v5, upload-pages-artifact v4, deploy-pages v4. Reference: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## GitHub settings

1. In [account Settings → Pages](https://github.com/settings/pages), add `whatclaudemade.com` as a verified domain. GitHub displays a TXT record; copy its exact name and value into Route 53, then click Verify. The expected name is `_github-pages-challenge-bishopdynamics.whatclaudemade.com`, but use GitHub’s displayed value. Keep the TXT record afterward. [Domain verification instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
2. In [repository Settings → Pages](https://github.com/bishopdynamics/made-with-claude/settings/pages), set **Build and deployment → Source: GitHub Actions**. The workflow selects `main`; do not select branch-based publishing.
3. Set **Custom domain: whatclaudemade.com**, then Save, before adding the website-routing DNS records below. DNS checks can remain pending until the records are added. Custom Actions deployments use this setting and do not require a `CNAME` file.
4. After DNS and certificate provisioning succeed, enable **Enforce HTTPS**. GitHub provides the certificate; there is no ACM certificate to configure for this setup.

Source: [GitHub custom-domain settings](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Route 53 records

Open **Route 53 → Hosted zones → whatclaudemade.com** (the public zone). Use **Simple routing**, **Alias: No**, and **TTL: 300 seconds**. Leave the record-name field blank for the apex; for `www`, enter only `www`. Enter multiple addresses as separate lines in the same record set.

| Record name in the zone | Type | Values |
| --- | --- | --- |
| blank (apex) | A | `185.199.108.153`<br>`185.199.109.153`<br>`185.199.110.153`<br>`185.199.111.153` |
| blank (apex) | AAAA | `2606:50c0:8000::153`<br>`2606:50c0:8001::153`<br>`2606:50c0:8002::153`<br>`2606:50c0:8003::153` |
| `www` | CNAME | `bishopdynamics.github.io` |
| GitHub-provided challenge name | TXT | Exact verification value shown in GitHub account settings |

The `www` CNAME points to the account’s Pages hostname, with no scheme, repository path, or trailing URL path. GitHub redirects `www.whatclaudemade.com` to the configured apex. IPv6 is optional; if AAAA records are added, keep the A records as well. Preserve the existing NS/SOA and unrelated email/TXT records. Do not create a wildcard record or an apex CNAME. These are standard records, not an AWS alias to GitHub.

The four A and AAAA targets and `www` behavior are from [GitHub’s DNS instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), checked September 10, 2026. [Route 53 console record creation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-creating.html) documents the console flow. Route 53 generally distributes updates within 60 seconds, while cached DNS answers and GitHub certificate availability can take longer; GitHub advises allowing up to 24 hours.

The initial public DNS inspection found these authoritative name servers and no apex A/AAAA, www CNAME, or CAA answers:

- `ns-1876.awsdns-42.co.uk`
- `ns-379.awsdns-47.com`
- `ns-811.awsdns-37.net`
- `ns-1239.awsdns-26.org`

Use the existing public hosted zone matching those name servers. No nameserver change is needed if that is the zone being edited.

## Verify launch and future publication

- Run `make check` before pushing; review the actual `dist/` artifact with `npm run preview`.
- Confirm `dist/sitemap.xml` contains home, catalog, and the two accepted project pages, with no draft URLs. Confirm `robots.txt` points at the canonical sitemap. Local fonts/media must resolve inside the artifact.
- Push reviewed commits with `git push github main`. Follow [Actions](https://github.com/bishopdynamics/made-with-claude/actions) through checks, artifact upload, and deployment.
- Check HTTPS for the apex, both project pages, sitemap, robots, fonts/images, and 404 behavior for a draft URL. Check `www` redirects to the apex and HTTP redirects to HTTPS after enforcement.
- Future approved articles use the same workflow. `updatedOn` records revisions; `publishedOn` remains the first publication date. To undo a bad publication, revert its source commit and push a new checked deployment.

Public DNS checks:

```sh
dig +short whatclaudemade.com A
dig +short whatclaudemade.com AAAA
dig +short www.whatclaudemade.com CNAME
dig +short _github-pages-challenge-bishopdynamics.whatclaudemade.com TXT
```

## Launch record

- September 10: public repo verified; Pages initially disabled. Domain delegated to Route 53 with no website records. Old remote Check runs failed in `npm run check`; install/Node setup passed. Full old logs require repository-admin API access unavailable to this session. Current local safeguards and the full check suite pass with GitHub Actions environment flags; the fresh hosted run remains the final CI check.
- User enabled Pages Source=GitHub Actions, saved the custom domain, and updated Route 53. Authoritative DNS now returns all four expected A values and the correct www CNAME. Ownership-verification TXT was not yet visible at the latest check.
- Fixed draft-image emission before upload: production sync preserves raw validation and omits draft asset registration; cold/warm-cache regressions and real-artifact hashes confirm all nine unpublished media originals are excluded. Worker and parent full checks passed 48 tests, zero Astro diagnostics/privacy findings; actionlint passed. Browser review passed for desktop/mobile homepage, both articles, gallery originals, local images/fonts, and catalog. The artifact contains five HTML pages, four sitemap URLs, and robots.txt.
- Launch commit `4840dad` was pushed to main. [First launch run](https://github.com/bishopdynamics/made-with-claude/actions/runs/34519490584) failed seven safeguard tests; upload/deploy were skipped. The user supplied the full output in an ignored local scratch directory. Reproducing with a source path inside a runner-style home directory produced the same seven failures: the test fixture's directory-only `node_modules/` ignore rule accidentally staged its dependency symlink, whose target correctly triggered the privacy scanner. Fixed both fixture ignore rules and added ignored/unstaged assertions, preserving scanner policy. The same runner-style reproduction now passes all 15 safeguard tests; worker and parent full checks pass all 48 tests with zero Astro diagnostics and zero privacy findings across 300 snapshots. Parent independently reproduced the passing home-path setup. The correction is ready for the next hosted run.
- Apex DNS now resolves correctly on this machine as well as authoritative, Cloudflare, and Google resolvers. HTTP reaches GitHub Pages but still serves its default 404 until deployment succeeds; www redirects to the apex. The custom-domain certificate is not ready yet. The user made the DNS/settings changes; the agent is monitoring deployment and HTTPS.
