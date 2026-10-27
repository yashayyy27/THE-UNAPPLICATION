# Cinematic v2 · verification and visual review

28 October 2026 · independent application for Yash Hurdale · no deployment or visibility change.

## What changed

Original procedural signal aperture, finite Noise → Signal → Decision story, immediate headline/identity/CTA, sticky direct navigation, pause/skip controls and a quiet ivory executive resolution. The three analytical lenses have state-driven event separation, attribution flows and cohort-volume graphics. All six red-team challenges retain their conclusions, revisions and required evidence, with a corresponding explanatory visual. The recommendation now exposes the problem, finding and uncertainty directly.

No videos, downloaded footage, external fonts, streaming services, WebGL libraries or production dependencies were added. This is authored SVG/CSS procedural motion, not a claimed rendered film. Original analytical functions, fixture data, evidence definitions, provenance and brief exporters are unchanged. Exclamation AI is untouched. Resume navigation reaches a clearly labelled availability note.

## Observed verification

- Baseline: 24 unit/component tests and all 12 existing browser cases passed before the redesign.
- Candidate: **32 unit/component tests passed** across three files; strict TypeScript and Next.js production static export passed. [Check output](check-results.txt).
- Candidate: **32 desktop/mobile Chromium browser tests passed**, including every original case. [Browser output](browser-results.txt).
- New coverage: finite intro pause/resume/skip, immediate navigation, unobscured anchor headings, reduced-motion changes, Save-Data, blocked media, unsupported observers, no-JavaScript fallback, offscreen/visibility suspension, exact visual counts/credit, viewport diagram activation without changing reserved height, and current-state downloads after cohort/cost changes. The current HTML brief prints to one A4 page.
- Axe WCAG 2 A/AA, 2.1 AA and supported 2.2 AA rules reported no violations in tested desktop/mobile states. Original branch accessibility checks remain included. Automated scans are not a WCAG certification or a substitute for a manual screen-reader/device review.
- A clean build was required after duplicated generated files appeared under `.next/types`. Only the generated cache was moved aside; no source or unrelated project was removed. The clean rerun passed. The cached duplication is not included in Git.
- `git diff` confirms no changes to `lib/analytics.ts`, `lib/brief.ts`, `content/scenario.ts`, `content/edition.ts`, production dependencies or the Exclamation AI worktree.

## Actual rendered review

Reviewed the running application in Chrome, then inspected actual desktop/mobile captures of the hero, measurement, attribution, cohort, red-team and executive scenes. The initial mobile art competed with the copy; the final mobile treatment removes floating labels, fades the aperture and improves body-text sizing. The initial section screenshots caught sticky UI at awkward crop positions; final scene captures use normal viewport navigation and verify headings are not obscured.

- [Desktop opening](../screenshots/v2/desktop-hero.png) · [mobile opening](../screenshots/v2/mobile-hero.png)
- [Measurement](../screenshots/v2/desktop-measurement.png) · [attribution](../screenshots/v2/desktop-marketing.png) · [cohorts](../screenshots/v2/desktop-customer.png)
- [Red team](../screenshots/v2/desktop-red-team.png) · [decision](../screenshots/v2/desktop-decision.png)
- [Full desktop](../screenshots/v2/desktop-full.png) · [full mobile](../screenshots/v2/mobile-full.png)
- [Baseline desktop](../screenshots/v2/baseline-desktop-hero.png) · [baseline mobile](../screenshots/v2/baseline-mobile-hero.png)

At the captured test viewports, the complete desktop page is approximately the same length as v1; mobile depth is about 1% greater. The mandatory route still uses direct links from problem → inquiry → challenge → decision. The 60–90-second target remains a design target, not a timed recruiter study.

## Performance method and corrections

Lighthouse 13.5.0, the same Chromium executable, default mobile simulation, Node 24, identical uncompressed Python static-server settings. Final comparison uses frozen v1/v2 production exports served from the same temporary filesystem, without concurrent browser tests. Candidate copy matches the built index checksum. Reports are written outside the workspace during measurement and copied back afterward. Three alternating runs per version are retained; report medians descriptively, not as statistical significance or field Core Web Vitals.

Development runs identified extra SVG markup, layout movement in the changing motion control, SVG-group repaint work and avoidable below-fold rendering. Corrections: compact count-preserving vector paths, rounded geometry, fixed control width, a finite transform on an HTML compositing layer, viewport-activated diagrams with static posters and reserved heights, and browser-idle priority before optional intro playback. Exact readouts and native controls are always rendered; motion never gates content.

Initial development reports and earlier comparison summaries are retained for transparency. Those were made while iterating in the workspace and are not substituted for the final frozen-export comparison. No scores are fabricated, averaged across different versions, or described as production field measurements.

## Final measured comparison

| Mobile lab metric (median of 3) | v1 | Cinematic v2 |
|---|---:|---:|
| Performance | 85 | 82 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 60 | 60 |
| LCP | 4.01s | 4.29s |
| Total blocking time | 160ms | 218ms |
| CLS | 0.00000 | 0.00023 |
| Uncompressed transfer | 534.4 KiB | 571.9 KiB |

[Summary and all six final reports](performance/summary.json). Individual performance scores: v1 84/85/86; v2 82/83/77. No best-run cherry-picking. The extra presentation remains measurably heavier: +37.6 KiB uncompressed, +275ms median LCP, +58ms median blocking time. The optimisations did **not** eliminate every regression. This is an explicit review trade-off, not a performance improvement claim. The pull request remains a draft for owner review; further mobile performance work is warranted before calling this release performance-complete.

The noindex SEO limitation and uncompressed local-server conditions apply equally to both versions. The candidate HTML is 38,514 bytes raw / 11,039 bytes gzip, versus v1 26,627 / 8,040; gzip sizes are local byte calculations, not a hosted benchmark. Actual hosting compression, cache headers and field Core Web Vitals remain unmeasured because deployment was not authorised.

## Remaining boundaries

- Owner-approved resume, manual VoiceOver/real-device review and recruiter timing are still human validation steps.
- Only Chromium desktop/mobile is automated here; other browser/device performance is unmeasured. Motion preference and Save-Data support use available browser APIs plus CSS fallbacks.
- Native static hosting compression/cache policy and actual field Core Web Vitals require an authorised deployment. None was made. Review-only `noindex,nofollow` remains intentional.
- No role requirement, qualification, client result, uplift or live AI result has been invented. The supplied target listing remains unverified as documented in the original evidence audit.
