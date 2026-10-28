# Post-launch recruiter audit · 29 October 2026

Focused branch: `codex/post-launch-recruiter-audit`, based on published main `08906d61e539ce0a7f073e1292e55cc07aa84e04`. The proposed changes require owner review. The live site remains on the previous release; this audit does not merge, publish or dispatch a deployment.

## Public experience

- Replaced “ILLUSTRATIVE / REVIEW DRAFT” with “SYNTHETIC SCENARIO / NOT CLIENT DATA”. Removed the draft suffix from both brief formats and PDF metadata, and removed the HTML brief’s internal applicant-review instruction. Synthetic counts, measurement assumptions, uncertainty, no-uplift/no-causality statements, independent-project attribution and pinned verification links remain.
- Added four direct opening links: SQL source, Python source, BigQuery historical run and GA4/GTM owner test. Their labels and nearby scope link distinguish code, public-data analysis and test receipts. They use the same audited Exclamation AI revision as the evidence cards; neither Google authentication nor source execution was repeated for this audit.
- Replaced the generic introduction with factual education, tools, product/data roles and commercial operations experience from the existing owner-approved resume. The PDF and its approval record remain byte-for-byte unchanged. The public labels now read “Download resume (PDF)” rather than internal approval terminology; the file-identity build gate remains intact.
- Paired **Interview Yash** with a direct **Resume (PDF · 96 KB)** download in the final scene. The existing email address is unchanged; the subject identifies the interview and Data Analyst role. GitHub, LinkedIn and portfolio remain available. No email was sent or application submitted.
- Added the canonical public URL and Open Graph/Twitter summary metadata. The description names the evidence and interview route. Review builds retain `noindex,nofollow`; release builds retain `index,follow`.

### Candidate copy provenance

Source: the existing approved two-page PDF, recorded in [resume provenance](../RESUME-RELEASE.md), 97,795 bytes; SHA-256 `fbbb4f87199b84eff9ccb023e16ab358f70941ce803212d279719818923e052f`.

| Public introduction | Resume basis |
|---|---|
| Sydney-based Business Analytics graduate | Sydney NSW; Master of Business Analytics |
| SQL, Python, Excel and Power BI | Professional summary and technical skills |
| Assistant Product Manager and Business & Data Analyst Intern experience | Named professional-experience roles |
| Commercial/restaurant operations at Nando’s | Current Assistant Manager and earlier Shift Leader responsibilities |

Employment and education remain candidate-supplied. Project verification does not independently certify them. No quantified professional achievement, tenure, client result or proficiency level was invented.

### R/GA wording

Reopened the [official Data Analyst listing 8302236](https://www.rga.com/careers/8302236?gh_jid=8302236). It supports Python/SQL, tracking QA, reproducible AI workflows, clear recommendations and familiarity with at least two listed tool groups. GA4/GTM counts as one group, BigQuery as another. The expandable disclosure distinguishes those requirements from Yash’s interpretation of project fit. The existing [full requirements and evidence map](../ROLE-EVIDENCE-MAP.md) retains the unverified live-model, SDK, production export, adoption and commercial-impact gaps.

The header/body location discrepancy remains explicit: Japan versus Tokyo or Melbourne/Sydney. Confirm location and availability with recruiting; no eligibility, salary, closing date or employer validation is inferred.

## Before/after visual review

Real Chromium captures, not mockups. **Before:** signed-out live site at the published commit above. **After:** local final production export. Both use reduced motion to compare stable content at identical viewports: desktop 1280×900 CSS pixels, mobile iPhone 13 emulation 390×664 CSS pixels (DPR 3). Resume images are element close-ups. Browser tests separately exercise the running introduction, pause, skip, mobile Play and preference changes. Mobile emulation is not a physical-device or Safari assessment.

| Scene | Before | After |
|---|---|---|
| Desktop opening | [Capture](screenshots/before-desktop-hero.png) | [Capture](screenshots/after-desktop-hero.png) |
| Mobile opening | [Capture](screenshots/before-mobile-hero.png) | [Capture](screenshots/after-mobile-hero.png) |
| Desktop decision | [Capture](screenshots/before-desktop-decision.png) | [Capture](screenshots/after-desktop-decision.png) |
| Mobile decision | [Capture](screenshots/before-mobile-decision.png) | [Capture](screenshots/after-mobile-decision.png) |
| Desktop introduction/resume | [Capture](screenshots/before-desktop-resume.png) | [Capture](screenshots/after-desktop-resume.png) |
| Mobile introduction/resume | [Capture](screenshots/before-mobile-resume.png) | [Capture](screenshots/after-mobile-resume.png) |
| Desktop interview invitation | [Capture](screenshots/before-desktop-contact.png) | [Capture](screenshots/after-desktop-contact.png) |
| Mobile interview invitation | [Capture](screenshots/before-mobile-contact.png) | [Capture](screenshots/after-mobile-contact.png) |
| Default brief, Poppler-rendered | [Page](screenshots/before-default-brief.png) | [Page](screenshots/after-default-brief.png) |

The inspected after views preserve the charcoal/citron aperture, oversized headline, ivory decision scene and existing hierarchy. The opening challenge and four evidence links are visible in the captured mobile opening. The final invitation and resume fit together in the mobile contact view. The one-page PDF is legible without clipping or overlap.

Reproduce captures with `node scripts/capture-recruiter-audit.mjs before|after URL`. [Additional width audit](viewport-audit.json) covers 320, 375, 390, 540, 768 and 1280 CSS pixels at height 800: no horizontal overflow, all four entry links present and the primary CTA within the viewport. No design or performance claim is inferred solely from screenshots.

## Verification

[Command results](verification.txt) record the local checks. New tests cover opening evidence, bounded role copy, the final interview/resume pairing, unchanged resume bytes, absence of internal draft wording, all 18 current-state brief combinations and preserved disclosures. Existing analytical, accessibility and motion checks remain.

| Check | Result |
|---|---|
| Strict TypeScript + all unit/component tests | Pass, 40/40 |
| Production static export | Pass, root and `/THE-UNAPPLICATION` release configuration |
| All desktop/mobile browser tests | Pass, 50/50 |
| Local GitHub Pages subpath smoke | Pass, 6/6 desktop/mobile checks including release metadata and downloads |
| Automated accessibility | No axe violations in tested states, including supported WCAG 2.2 AA rules |
| Reduced motion / Save-Data / no JavaScript / failed assets or diagram loads | Existing browser cases pass; evidence and downloads remain accessible |
| Current-state brief and print-to-PDF | Current choices retained; tested printed examples remain one page |
| Default PDF | One A4 page; text, metadata, disclosures and pinned hyperlink checked; final page rendered and inspected |
| Approved resume | Both download entry points preserve the configured SHA-256 and 97,795 bytes; no PDF substitution |
| Production dependency audit | Zero reported vulnerabilities |
| Preservation | Analytics, brief model, fixtures, motion system, diagrams, resume file/approval, dependencies and Pages workflow unchanged; Exclamation AI clean and untouched |

### Link and asset audit

[Read-only GET results](link-audit.json) cover every unique HTTPS link in the root production HTML, local downloadable assets and the mailto address/subject. Redirects are followed without sign-in. All checked GitHub evidence/selected-work links, the official role, portfolio and site returned HTTP 200. LinkedIn returns **999** to automated requests: retained owner-supplied URL, requires a normal signed-out browser check and is not reported as verified. A 200 response verifies reachability, not every claim in an external page. `mailto:` structure was inspected; email delivery was not tested. The downloadable fixture, manifest, default brief and approved resume exist and are exercised under the project path.

Reproduce with `node scripts/audit-recruiter-links.mjs` after a root export. No tracking, remote media, new dependency or promotional branding was introduced.

### Retained performance evidence

The accepted prior paired medians remain **85→85 Lighthouse performance, 4.09→4.24s LCP, 154.5→67ms TBT** (v1→Cinematic v2). The owner accepted the minor LCP trade-off. [Original reports, traces and adverse comparisons](../recruiter-readiness/REVIEW.md#performance-evidence) and their screenshot bytes are preserved. These are historical local lab observations, **not measurements of this copy/link audit**; no new Lighthouse or field-performance claim is made. This pass adds only text, native links, metadata and small styles; art, scheduling, rendering strategy and numerical code remain unchanged.

## Owner review and release gate

- [ ] Approve the candidate introduction, commercial-experience wording, final interview invitation and R/GA caveat against the approved resume/source.
- [ ] Open LinkedIn in a normal signed-out browser. Confirm contact address and interview subject in a composer, then cancel without sending.
- [ ] Spot-check the changed links and copy on a physical phone and Safari/VoiceOver. Earlier manual checks were owner-reported; they are not a fresh agent assessment of this branch.
- [ ] Download the resume and both brief formats; confirm the approved PDF, synthetic disclosures, selected analytical state and clear uncertainty.
- [ ] Review the PR diff, before/after captures and exact-head CI.
- [ ] Give explicit merge and deployment approval. Only then follow [GitHub Pages release instructions](../DEPLOYMENT.md), dispatch from reviewed main, and verify the deployed SHA and live project-path smoke tests.

No merge, publication, visibility change or deployment dispatch is part of this audit. The remaining review steps do not imply that prior owner approval automatically covers this new branch.
