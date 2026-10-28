# Private GitHub source → public website

Prepared 29 October 2026. **Instructions only. Nothing has been connected, merged, uploaded or deployed by this preparation.** Current distribution remains the private GitHub repository and draft PR #1. The owner previously chose GitHub only; these instructions do not override that restriction. A future host connection/source transfer and public deployment require explicit owner authorization.

## 1. Complete local owner review

1. Complete [FINAL-OWNER-REVIEW.md](FINAL-OWNER-REVIEW.md), including physical mobile, Safari, VoiceOver, downloads, contact and analytical copy. Record the reviewed commit and outcomes.
2. When supplied, integrate only the actual owner-approved resume using [RESUME-RELEASE.md](RESUME-RELEASE.md). Until then, retain the pending/contact state and include it in owner review. No replacement PDF or fabricated credentials.
3. Confirm indexing preference. Current `app/layout.tsx` uses `robots: { index: false, follow: false }`. This permits a public, directly shareable website. If the owner wants indexing, review a change to `true/true`, rebuild and recheck metadata before release. Noindex is not access control.
4. On Node 24, run from the repository root:

   ```sh
   npm ci
   npm run check
   npm run test:e2e
   npm audit --omit=dev
   git diff --exit-code -- public/scenario.json public/evidence-manifest.json docs/EVIDENCE-MANIFEST.md public/scenes.css app/artwork.css
   ```

   On a clean browser-test machine first install Chromium with `npx playwright install --with-deps chromium`. Python 3 is used by the local static-preview test server. Review changed generated content before committing it; generated outputs must match their sources. Require passing GitHub CI on the exact final PR head. Keep the existing performance reports unchanged; the owner has accepted their minor LCP trade-off.

## 2. Obtain release approval, then merge

Record owner approval for **both** the reviewed merge and public hosting, naming the hosting account/provider and authorizing that provider to read this repository. Use an owner-approved plan; do not activate billing or buy a domain by assumption. If hosting approval is absent, keep the host disconnected. Approval to merge alone does not authorize deployment.

After merge approval, merge PR #1 into `main` using GitHub. Record the resulting main commit and require its verification workflow to pass. Keep `yashayyy27/THE-UNAPPLICATION` **private**. Do not change Exclamation AI. Keep the hosting integration disconnected until public-deployment approval is also present.

## 3. Configure Cloudflare Pages after hosting approval

This is one concrete static-host option, not an account already selected or created. Cloudflare supports [private GitHub repositories](https://developers.cloudflare.com/pages/get-started/git-integration/#select-your-github-repository) and [Next.js static exports](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/). Its builder reads private source; visitors receive public compiled HTML/CSS/JS and approved public downloads. Private source does not make rendered contact information or PDFs private.

1. In the owner-approved Cloudflare account, open **Workers & Pages → Create application → Pages → Import an existing Git repository / Connect to Git**. Use the Pages static flow.
2. Authorize the Cloudflare Workers & Pages GitHub App for **only** `yashayyy27/THE-UNAPPLICATION` using selected-repository access. Leave other repositories, especially Exclamation AI, outside this grant.
3. Select the repository and configure before the first deployment:

   | Setting | Value |
   |---|---|
   | Project name | Owner-approved available name, such as `the-unapplication` |
   | Production branch | `main` |
   | Root directory | Repository root (blank or `/`) |
   | Framework preset | Next.js (Static HTML Export) |
   | Build command | `npm ci && npm run build` |
   | Build output directory | `out` |
   | Build environment variable | `NODE_VERSION=24` |
   | Application secrets | None |

   Override the preset's `npx next build`: this project's npm script runs content generation, approved-PDF validation and the existing webpack build. Node 24 is required; [the build image supports a NODE_VERSION override](https://developers.cloudflare.com/pages/configuration/build-image/#languages-and-runtime). The host may install dependencies first; explicit `npm ci` ensures the lockfile is used. Do not omit dev dependencies during this build.
4. **Save and Deploy publishes the website.** Click only after recorded hosting approval. Confirm logs identify the approved main commit, Node 24, successful prebuild verification and static `out/` output. No API keys, paid calls, database or server runtime are needed.
5. In **Settings → Builds & deployments / Branch control**, set **Preview branches: None** and disable automatic production deployments after this approved first release. Do not push other changes during initial configuration. For future releases, enable production deployment only for the owner-approved main update, verify it, then disable it again. [Official branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/).

## 4. Verify public access before sharing

Record the actual HTTPS `*.pages.dev` URL, deployment ID and source commit; the example project name may be unavailable. A custom domain is optional and requires owner/domain approval.

In a signed-out/private browser without a host login, check `/` and `/#proof`, `/#resume`, `/#contact`; static first arrival; Play/Pause/Skip; all investigations/challenges; changed-state HTML download/PDF printing; default PDF; approved resume or honest pending state; contact/profile/evidence links. Repeat mobile/Safari/VoiceOver priorities from the [owner checklist](FINAL-OWNER-REVIEW.md). Verify a missing path gives 404 and no assets/chunks fail. Serve the export at the **origin root**; do not add a subpath or SPA catch-all redirect.

Confirm HTTPS, public access and chosen robots metadata. Record failures before recruiter sharing. Existing local Lighthouse results are not measurements of hosted performance, cache behaviour or field Core Web Vitals.

## 5. Recovery

For a regression after a successful production release, open **Deployments → desired known-good deployment → actions menu → Rollback to this deployment**, confirm and recheck. [Official rollback procedure](https://developers.cloudflare.com/pages/configuration/rollbacks/). Preview deployments are not rollback targets. A failed first launch has no earlier production target: withhold recruiter sharing, keep automatic deployments disabled and obtain approval for the correction. Disabling builds does not withdraw already-public assets; withdrawing the site requires an owner decision.

No hosting config, deploy credential or publication workflow is added here. Repository visibility, indexing and website availability remain separate owner choices.
