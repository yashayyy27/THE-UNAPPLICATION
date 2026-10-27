# Deployment and owner review

## Current distribution

The separate GitHub repository is private at creation. A private Site shell was registered, but its source transfer was rejected by automatic approval review. The owner subsequently chose GitHub only. No source was transferred and no hosted review has been deployed. Public recruiter access has not been authorised; an owner-private review URL is not a recruiter-shareable release. See the delivery message for the verified publication status and actual URL.

## Vercel

1. Import `yashayyy27/THE-UNAPPLICATION` in the intended Vercel account.
2. Select Next.js, Node 24, install `npm ci`, build `npm run build`.
3. The framework uses static export; `out/` is the output for a static deployment.
4. Preview all investigation paths, downloads and contact links. Retain review-only access until the owner chooses to publish.

No environment variables, API secrets, payment setup or external paid service is required. Use the hosting plan and account explicitly chosen by the owner; do not activate a paid service by assumption.

## Other static hosts

Upload the contents of `out/` to a static host. All routes/assets assume an origin-root deployment. A GitHub Pages subpath deployment needs a deliberate `basePath` configuration and matching asset checks; do not upload unchanged source to a subpath and assume it works. `trailingSlash: true` supports directory index hosting. Serve `404.html` for unknown routes and use HTTPS. Apply the host's normal compression and immutable caching for `/_next/static/*`.

## Sites review

The ignored local `.openai/hosting.json` and host runtime state bind this checkout to its private review Site. After explicit owner approval, use the Sites workflow to build/package the static `out/` directory, push matching source, save that commit/archive and deploy. No tokens are committed. Keep GitHub `origin` intact; provider source synchronisation is a separate remote destination. Native deployment success is required before reporting publication.

## Before recruiter sharing

- Owner chooses whether the repository and hosted experience should become public. They are separate visibility decisions.
- Supply an approved resume if a resume download is wanted. Add only verified identity/background information.
- Review all analytical assumptions and practise explaining the lineage, uncertainty and trade-offs.
- Confirm the target role and replace the unavailable listing with a current official source if available.
- Conduct a short recruiter timing check and manual VoiceOver/device review; automated axe checks are not certification.
- For a public release, deliberately revisit `robots` metadata. `noindex,nofollow` is intentional for private review; it reduces the Lighthouse SEO score.
