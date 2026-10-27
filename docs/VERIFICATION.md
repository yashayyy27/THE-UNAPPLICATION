# Observed verification · 28 October 2026 (Australia/Sydney)

> Historical v1 release record. Current cinematic branch verification and performance trade-offs are in [the v2 review](cinematic-v2/REVIEW.md).

All results below are for THE UNAPPLICATION unless explicitly labelled upstream. Local checks used the bundled Node 24.22.1 runtime, Next.js 16.4.3, Vitest 4.1.12 and Chromium. No paid services or model calls.

## Completed

- Strict TypeScript: passed.
- Vitest/React Testing Library: **24/24 tests passed**, two files. Tests cover counts/invalid inputs, zero denominators, independent Wilson oracle, all three revenue-credit rules, conservation of USD 150, sensitivity, break-even, cohort additivity, all 18 path/challenge brief combinations and selected cohort/attribution preservation.
- Next static production build: passed; `out/` contains the site and assets. [Command output](check-results.txt).
- Playwright: **12/12 passed** across desktop and mobile Chromium. The opening CTA is visible within the tested desktop/mobile viewports; all investigation paths and six challenges work; the recommendation changes; current-state HTML downloads; actual PDF bytes and one-page HTML printing are verified; fixtures, manifests, anchors and external link attributes are checked. No page errors were observed in the main journey. [Command output](browser-results.txt).
- Automated axe WCAG 2 A/AA and 2.1 AA scans: no violations in the initial and attribution states at desktop/mobile test viewports. Native keyboard entry, skip link, reduced motion and no horizontal overflow passed. These are automated checks, not full manual screen-reader certification.
- Default PDF: one A4 page; generated from `scripts/build-brief.py`, rendered with Poppler using a writable local font cache and visually inspected. The first render attempt needed explicit fontconfig paths; the corrected render was reviewed. The current-state HTML is separately print-tested in Chromium.
- npm dependency audits: **zero reported vulnerabilities**, production and full dependency trees at the time checked. [Production](production-dependency-audit.json), [full](dependency-audit.json). Initial development dependency advisories were fixed by updating Vitest/Lighthouse before final checks.
- Exclamation AI remained clean and unchanged at `35f1aff81c166215496b0f0b2b041db7a4c0360e`; its remote main matched when audited. Relevant source paths exist at that revision. Historical upstream Google and test receipts remain separately qualified.
- Actual full-page and viewport screenshots captured from the production build: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png). No synthetic screenshot mockups.

## Lighthouse

Lighthouse 13.5.0 on the local production export, standard mobile simulation, one final run:

| Category | Observed score |
|---|---:|
| Performance | 88 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 60 |

Largest Contentful Paint 3.8s; Cumulative Layout Shift 0. The SEO score is reduced by intentional `noindex,nofollow` review metadata. The local Python server supplies neither production compression nor long-lived cache headers. JavaScript transfer and mobile LCP remain improvement opportunities. These scores are measurements of this local run, not a promise of hosted performance or a complete accessibility assessment. [Full report](lighthouse-mobile.json).

## Remaining boundaries

- Repository is created private. A Site shell was registered but automatic approval review rejected source transfer to the separate hosting destination because the user authorised GitHub creation without explicitly authorising that transfer. No hosted application has been deployed. The owner then explicitly chose GitHub only. No source was transferred to Sites. Source/build and exact future hosting instructions are available.
- No approved resume or independently verified background credentials were supplied. The UI explains the resume gap instead of providing a fabricated file.
- Exact role requirements and vacancy status remain unverified because the official listing was inaccessible. Company interpretation is based on the official public About page, not confidential research.
- No live model performance, BigQuery SDK transport, causal/client outcomes or revenue uplift claimed. Historical Google receipts are upstream documented observations, not new authenticated checks.
- PULSE, RESTOPS and Apex Insights descriptions are grounded in inspected READMEs at linked revisions. Their implementations/test suites were not rerun for this edition.
- The initial [hosted GitHub verification](https://github.com/yashayyy27/THE-UNAPPLICATION/actions/runs/40524875404) passed at commit `9b889487a583443bf2cc3ebd1cf96258ef83e605`, including install, content consistency, types/unit tests/build, Linux desktop/mobile browser tests and the production dependency audit. That run does not establish success for later commits; check the latest workflow separately. Manual VoiceOver/real-device review, recruiter timing and owner understanding remain human review steps.
