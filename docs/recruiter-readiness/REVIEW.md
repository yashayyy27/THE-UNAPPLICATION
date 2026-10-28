# Performance and recruiter readiness · 28 October 2026

Review of `design/cinematic-experience-v2`, updating PR #1. The original charcoal/citron identity, editorial headline, 22-ring signal aperture, three investigations, six red-team challenges, analytical calculations, provenance and brief exports remain intact.

## Recruiter journey and visual review

Yash’s opening value statement now names inspectable business analysis, SQL and Python. The primary CTA starts with the business question. **The challenge** navigation goes directly to the signature red-team interaction. Investigation, evidence, resume and contact remain one-click destinations, independent of animation completion. Native anchor offsets no longer double-count the sticky header or shift as offscreen scenes expand. Mobile navigation has larger type and 44px-high targets.

Touch/coarse-pointer devices open on the complete static composition, with visible **Play introduction** controls in the header and hero. The full finite story remains available on demand; desktop starts automatically after load, two painted frames and an idle opportunity. This is a deliberate change to the default mobile experience and is included in the reported arrival measurements. Reduced-motion and Save-Data users keep a complete static experience. Pause, resume, skip and offscreen/visibility suspension remain functional.

The running desktop application was reviewed in Chrome. Real rendered desktop/mobile captures were inspected for the hero, analytical scenes, challenge and ivory decision. Screenshots wait for the actual analytical graphic, rather than capturing a loading poster. The full-page captures expand native anchor targets and render real content; they are not stitched mockups.

| Prior v2 | Current v2 |
|---|---|
| [Desktop opening](screenshots/before-desktop-hero.png) | [Desktop opening](../screenshots/v2/desktop-hero.png) |
| [Mobile opening](screenshots/before-mobile-hero.png) | [Mobile opening](../screenshots/v2/mobile-hero.png) |
| [Desktop decision](screenshots/before-desktop-decision.png) | [Desktop decision](../screenshots/v2/desktop-decision.png) |
| [Mobile decision](screenshots/before-mobile-decision.png) | [Mobile decision](../screenshots/v2/mobile-decision.png) |

The comparable opening/decision captures above use reduced motion for stable review. Also inspect the actual [default mobile Play state](screenshots/mobile-default-hero.png), [mobile introduction playing](screenshots/mobile-intro-playing.png), [attribution flow](../screenshots/v2/desktop-marketing.png), [cohort flow](../screenshots/v2/mobile-customer.png) and [challenge response](../screenshots/v2/mobile-red-team-response.png).

## What removes work

- The immutable original vector is now a self-contained CSS image layer, compiled from `styles/signal-aperture.svg`. Three opacity bands preserve all 22 rings. It adds no media request, document vector subtree or client geometry calculation. The animated HTML layer still carries the original aperture movement.
- Floating signal labels use compositable HTML transforms. The hero no longer continuously paints an SVG stroke-dash animation. Mobile’s fade uses a painted gradient rather than an alpha mask. Motion-control icons use CSS geometry instead of additional symbol-font glyphs.
- First-frame CSS is separated from concurrent scene styling. The native stylesheet listener applies scene CSS after first paint without waiting for hydration; noscript retains full styling. Late scene styles do not move the hero or first business heading. Prebuild minifies scene CSS with the compiler already bundled in Next; no package was added.
- Offscreen chapters use browser layout/paint containment. Any native hash target restores full chapter layout before navigation, preventing estimated-height jumps. Printing expands everything.
- Analytical diagram code and DOM activate near their scene through React lazy/Suspense. Exact readouts, assumptions and controls remain in initial HTML. Reserved heights keep them stable. A failed diagram has a visible unavailable notice while calculations, evidence and exports continue working.
- The HTML brief exporter loads on download intent. Loading, retry and default-PDF fallback states are explicit; a delayed export preserves the click-time selection while controls remain interactive. The original pure `briefText` model is moved unchanged to `lib/brief-model.ts`, and the previous `lib/brief.ts` exports remain compatible.
- Static evidence is memoized and the hero element remains stable during analytical state changes. The original pure calculations and fixtures are unchanged.

## Verification

- **36/36 unit/component tests**, strict TypeScript and Next production static export passed: [check output](check-results.txt).
- **44/44 desktop/mobile browser tests** passed, including all original cases: [browser output](browser-results.txt).
- Automated axe checks include supported WCAG 2.2 AA rules with no violations in the tested states. Keyboard navigation, unobscured viewport destinations, reduced-motion changes, Save-Data, unsupported observers, no JavaScript, failed media/styles/diagram code, current-state HTML downloads and one-page PDF printing are covered. Failed-export retry and delayed click-time snapshot handling are also covered.
- A real-clock touch test starts the complete introduction, reaches its sorting phase, captures it and skips to its resolved state. Timer pause/resume/completion is separately covered with deterministic clocks.
- Resume tests reject missing, altered, external-path and non-PDF approval records/files; valid file identity permits a native download.
- `lib/analytics.ts` and `content/scenario.ts` are unchanged. The brief model and HTML/export function bodies are preserved; only their delivery is split. [Preservation checks](preservation-results.txt). Evidence source commit and analytical claims are unchanged. Exclamation AI remains untouched. No runtime dependency, remote font, streaming service, tracking or promotional branding was added.

## Performance evidence

Five complete alternating runs per frozen production export, Lighthouse 13.5.0 and Chromium 156 on the same machine. Both exports used the same uncompressed Python static-server settings and fresh Chrome profiles. Default mobile simulation: 412 × 823, 4× CPU slowdown, 150ms RTT and 1638.4 Kbps throughput. No test, build, file write or active agent preview ran alongside the final quiet sequence. [All ten raw reports and summary](performance/summary.json).

| Latest five-run median | Unchanged v1 | Final cinematic v2 |
|---|---:|---:|
| Lighthouse performance | 85 | 85 |
| LCP | 4.09s | 4.24s |
| TBT | 154.5ms | 67ms |
| CLS | 0 | 0.00044 |
| Accessibility / best practices | 100 / 100 | 100 / 100 |
| Uncompressed transfer | 547,195 B | 582,009 B |

The latest quiet median matches v1's performance score. Blocking time is about **57% lower than that v1 run** and **69% lower than the prior cinematic median of 218ms**. The published prior cinematic result was 82 / 4.29s / 218ms; the incoming v1 reference was 85 / 4.01s / 160ms. Final LCP is only modestly lower than prior v2 and remains **about 0.15s slower than the matched v1**. The small LCP change is not presented as a robust LCP win. Transfer remains about **34 KiB above v1**, and is only about 3.6 KiB lower than prior v2. SEO stays 60 for both because the review build intentionally remains noindex.

The final CPU benchmark index medians are 1764.5 for v1 and 1764 for v2; the complete range is 1537.5–1778. All five runs are retained, including the slower v1 run. These are descriptive local measurements, not statistical significance or field Core Web Vitals.

### Audit trail and limits

[Intermediate comparisons](performance-history/) retain every round of the complete development sequences. Earlier matched medians included 86→83, 86→84 and 86→85. A later contended sequence of the final build also measured 86→85; its first baseline CPU benchmark index fell to 898.5, versus roughly 1700–1800 in the quieter runs. That prompted a predeclared complete quiet-host rerun rather than dropping individual observations. A strict zero-regression claim across every sequence is not supported: there is a one-point spread between some series. The latest full quiet series is the primary result, and the earlier gap remains visible.

[Development probes](diagnostics/) are separate from the matched comparisons. Full CSS inlining increased transfer and was discarded; that probe overlapped unit checks and is not treated as controlled evidence. An early CSS split introduced CLS around 0.074; first-business geometry and native anchor handling corrected it. Server-rendered evidence islands increased Flight/HTML payload and were replaced with memoization. The final build keeps synchronous first-frame styles, native post-paint scene styling and deferred diagram/export code.

### Actual trace findings

The original trace showed a 132.6ms first layout covering 825 objects, repeated SVG stroke paints and roughly 409ms in Lighthouse's rendering category. The final representative arrival trace shows a 65.0ms largest layout covering 187 objects, 8 Paint events instead of 356, and roughly 25ms in the rendering category. The prior and current traces have different mobile intro defaults: autoplay versus an explicit Play choice. These figures describe removed **arrival work**, not a frame-rate claim about the playing introduction.

Transferred first-frame CSS fell from 40,677 B to 23,914 B; the page script from 54,490 B to 49,085 B; HTML from 38,701 B to 32,776 B. The 24,352 B scene stylesheet still downloads concurrently; it applies after first paint without React. The image remains fully present in the initial composition.

[Prior v2 trace summary](traces/prior-v2-summary.json) · [v1 trace summary](traces/v1-summary.json) · [final trace summary](traces/v2-summary.json). Compressed real Chrome traces are alongside them. The final trace is the median-LCP sample (round 5), not a claim that every metric median occurred in one run. `scripts/summarize-trace.mjs` separates raw observed renderer milliseconds from Lighthouse's simulated metrics.

## Release checklist and limits

- [x] Preserve the independent cinematic identity and every analytical path/challenge/export.
- [x] Direct challenge, investigation, evidence, resume and contact navigation.
- [x] Static, reduced-motion, data-saving, no-JavaScript and loading-failure paths.
- [x] TypeScript, unit/component, browser, accessibility and production-build checks.
- [x] Real desktop/mobile screenshots and documented controlled performance measurements.
- [x] Owner accepted the minor LCP trade-off on 29 October 2026: retained medians 4.09s v1 / 4.24s v2, with performance 85 / 85 and TBT 154.5ms / 67ms. No further redesign or Lighthouse campaign requested. Field Core Web Vitals remain unmeasured.
- [ ] Supply and approve the resume PDF; configure its exact SHA-256/size in `content/resume.json`, then recheck the real download and PDF accessibility. [Instructions](../RESUME-RELEASE.md). No credentials or resume have been invented.
- [ ] Owner review of the finished creative experience, contact details and touch-first Play choice.
- [ ] Manual VoiceOver/physical-device and Safari/Firefox review; automated Chromium scans are not an accessibility certification.
- [x] Official listing and requirements checked on 29 October 2026; [research](../RESEARCH.md) and [Exclamation AI mapping](../ROLE-EVIDENCE-MAP.md) refreshed. Recheck availability/location when applying.
- [ ] Complete and sign the [final owner-review checklist](../FINAL-OWNER-REVIEW.md); approve merge and public deployment separately from this preparation. [Deployment instructions](../DEPLOYMENT.md).

The repository remains private and PR #1 remains unmerged. Nothing is deployed or published. Local Lighthouse observations are not hosted compression/cache measurements or field Core Web Vitals. Review-only `noindex,nofollow` is intentional.


## Final release preparation · 29 October 2026

The official listing is now accessible; [role research](../RESEARCH.md), [requirement-to-evidence mapping](../ROLE-EVIDENCE-MAP.md), [manual owner checklist](../FINAL-OWNER-REVIEW.md) and [private-source/public-site deployment instructions](../DEPLOYMENT.md) are current. Role provenance was corrected in the evidence disclosure and generated manifest. No styling, motion, calculations, fixtures, resume configuration or dependencies changed in this preparation.

Performance reports, traces, diagnostic history and screenshots above are retained from the preceding performance pass at `4bc9ae7`. They are not new measurements of the 29 October copy/documentation update. The owner accepts the minor LCP trade-off; no additional Lighthouse runs or broad redesign were undertaken.

Fresh local verification on the updated production export passed strict TypeScript, all 36 unit/component tests, the production build and all 44 desktop/mobile browser tests, including the existing axe checks. All 21 unique pinned upstream evidence targets in the mapping exist in the unchanged audited checkout; local documentation targets resolve. Manual Safari, VoiceOver, physical-device review and owner sign-off remain pending. No approved resume PDF was supplied. No merge, source upload to a host, publication or deployment took place.


## GitHub Pages publication preparation · 29 October 2026

The owner subsequently reported all requested manual checks complete and authorized GitHub publication. This records owner acceptance, not an independently performed agent Safari/VoiceOver assessment. An approved resume is still absent; its honest pending state remains accepted. [Current release instructions](../DEPLOYMENT.md) supersede the earlier Cloudflare option.

A manually dispatched Pages workflow builds from main on Node 24, verifies content, types, unit tests, production export, project-path desktop/mobile smoke checks and dependencies before uploading only out/. The release uses /THE-UNAPPLICATION/ as its build-time prefix; public metadata enables indexing only in the release environment. A direct-fragment smoke test exposed a desktop landing error after deferred CSS. The native loader now aligns the initial fragment once after styles settle, with cancellation on interaction/navigation; ordinary arrival and subsequent scrolling remain user-controlled. The original 44 browser tests passed before this final loader correction; final regression results are recorded in PR #1. All six project-path smoke tests pass after the correction. No analytical function, fixture, cinematic styling or dependency changed. All previous performance reports/screenshots remain unchanged, and no new Lighthouse result is claimed.

GitHub initially rejected Pages creation for the private repository with HTTP 422 because the current plan is ineligible. Visibility remains private until the owner explicitly chooses public source or an eligible plan. No paid upgrade is activated automatically; publication is not claimed without successful deployment and public browser verification.
