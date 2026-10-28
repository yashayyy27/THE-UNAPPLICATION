# GitHub Pages release

The owner reported all requested checks complete and authorized publication on GitHub's domain on 29 October 2026. Cinematic v2 and the accepted performance trade-off remain intact. No approved resume was supplied; retain its honest pending/contact state.

## Current hosting prerequisite

GitHub's Pages creation API returned HTTP 422: “Your current plan does not support GitHub Pages for this repository.” The repository is still private. Before enabling Pages, the owner must choose either making `yashayyy27/THE-UNAPPLICATION` public or using an eligible GitHub plan while keeping it private. Do not change visibility or buy an upgrade without that choice. [Official plan requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Release configuration

- Expected project URL: `https://yashayyy27.github.io/THE-UNAPPLICATION/`; verify GitHub's actual published URL after setup.
- Next.js static export remains `out/`. Set `NEXT_PUBLIC_BASE_PATH=/THE-UNAPPLICATION` at build time so framework assets/chunks use the project prefix. Scene CSS, favicon and the 404 return link also respect the prefix. Native brief, manifest and PDF links resolve within the project URL.
- Set `NEXT_PUBLIC_SITE_RELEASE=true` for the approved public build. This emits `index, follow`; ordinary local/review builds retain `noindex, nofollow`. Neither value controls public access.
- `.github/workflows/pages.yml` publishes only through **workflow_dispatch**, from `main`. Pushes do not publish automatically. Deployment requires the successful build job, the `github-pages` environment, Pages write permission and an OIDC token. [Official Pages workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- No external hosting account, custom domain, API key, paid model call, tracking service or dependency is added. Exclamation AI is untouched.

## Exact release steps

1. Resolve the visibility/plan prerequisite with the owner's explicit choice. Keep source private unless making it public is approved. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** (or create the Pages configuration through the Pages API with `build_type: workflow`).
2. Require the final PR #1 head to pass CI. Merge the approved PR into `main`; require its verification workflow to pass as well. Record the resulting main SHA.
3. In **Actions → Publish GitHub Pages → Run workflow**, select `main` and run once. The workflow installs with `npm ci`, verifies generated-content consistency, runs TypeScript/unit tests/build, installs Chromium, runs the project-path desktop/mobile smoke suite, checks production dependencies, uploads only `out/`, then deploys that exact artifact. A failed build/test cannot reach deployment.
4. Wait for both build and deployment to succeed. Record the workflow URL, main SHA and actual `page_url`. GitHub repository publication alone is not proof of a working website.
5. Open that HTTPS URL signed out. Confirm initial identity/CTA, intro controls, immediate navigation, all three investigations/six challenges, evidence links, cost/attribution/cohort changes, click-time HTML brief, default PDF, contact links and pending/approved resume state. Verify CSS/chunks load and the 404 return link returns to the project. Check mobile/Safari/VoiceOver priorities from [FINAL-OWNER-REVIEW.md](FINAL-OWNER-REVIEW.md).
6. Share only the verified public URL. Future releases need another deliberate workflow dispatch after owner approval; a push or merge alone does not publish.

## Local project-path verification

With Node 24 and Python 3, from the repository root:

```sh
npm ci
NEXT_PUBLIC_BASE_PATH=/THE-UNAPPLICATION NEXT_PUBLIC_SITE_RELEASE=true npm run check
npx playwright install chromium
npm run test:pages
```

`npm run test:pages` serves the export under `/THE-UNAPPLICATION/` on loopback port 4175, with desktop and mobile browser checks for hydration, local assets, decisions, current-state exports, static downloads, reduced-motion accessibility and 404 recovery. Build without those environment variables before running the original root-path `npm run test:e2e` suite. After publication, `PAGES_ORIGIN=https://yashayyy27.github.io npm run test:pages` runs the same checks against the public website without starting a local server. These checks do not replace owner manual device review or establish new Lighthouse results. Retained performance data stays in [the readiness report](recruiter-readiness/REVIEW.md).

## Recovery

To restore a previous known-good release, review and approve a revert PR to `main`, wait for CI, then run **Publish GitHub Pages** again. If the public site must be withdrawn, explicitly unpublish it through **Settings → Pages**; disabling future workflows does not remove an existing site. Do not delete the repository to roll back a website. [GitHub's unpublishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site).

No publication is claimed until GitHub reports deployment success and the public site is checked.
