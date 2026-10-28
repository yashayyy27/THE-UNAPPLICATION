# Final owner-review checklist

Prepared 29 October 2026 for draft PR #1, `design/cinematic-experience-v2`. **Owner reports all requested checks complete and authorizes GitHub publication on 29 October 2026.** This is owner-reported acceptance; the agent has not independently performed the manual Safari/VoiceOver/device checks. The owner subsequently explicitly approved public source/history to enable GitHub Pages on the existing plan. Record the final reviewed commit, device/browser versions, date and outcome below. Do not mark a manual check passed from Chromium emulation alone.

## Fixed release decisions

- Preserve Cinematic v2, the three investigations, six challenges, numerical functions, fixtures, evidence boundaries and current-state downloads.
- The owner accepted the minor LCP trade-off on 29 October: retained five-run medians **85 / 85 performance, 4.09s / 4.24s LCP, 154.5ms / 67ms TBT** (v1 / v2). [Full results and adverse comparisons](recruiter-readiness/REVIEW.md#performance-evidence) stay intact. No additional broad redesign or Lighthouse campaign is required. Field performance is unmeasured.
- No approved resume exists: `content/resume.json` remains `approved: null`. Keep the honest pending/contact state until the owner supplies and approves the actual file. [Exact integration procedure](RESUME-RELEASE.md). The missing PDF blocks the resume download, not the rest of the experience; include the pending state in owner release review and never insert a substitute.
- Official listing research is refreshed; [evidence mapping](ROLE-EVIDENCE-MAP.md) explicitly records partial matches and gaps. Those gaps do not justify stronger claims.

## Manual acceptance record

Review the local production export (`npm run build`, then `npm run preview`), not only the development server. During later hosted smoke checks, use the same record against the approved public URL.

| Check | Exact review | Outcome / device / reviewer / date |
|---|---|---|
| Mobile | Real iPhone Safari and Android Chrome, portrait/landscape. Read headline/value immediately; start the business question within 30s; reach evidence/recommendation/contact within 90s. No horizontal clipping, hidden CTAs, tiny labels, sticky-header obstruction or overlap. Check narrow width and enlarged text. | Owner-reported complete · 29 October 2026 |
| Safari | Current macOS Safari and iOS Safari: native anchors during motion, back/forward navigation, sticky header, scene styles, intro Play/Pause/Skip, offscreen resume and reload at `#proof`, `#resume`, `#contact`. Check first arrival with cache disabled and on a slow connection. | Owner-reported complete · 29 October 2026 |
| VoiceOver + keyboard | macOS Safari and iOS VoiceOver: meaningful heading/landmark order, labelled controls, visible focus, sensible announcements after challenge/slider changes, no trap or redundant narration of artwork. Complete one investigation, change a challenge, download and reach contact without a mouse. At 200% zoom, focused controls and text remain usable. | Owner-reported complete · 29 October 2026 |
| Motion / fallback | Reduce Motion before arrival and while open. Compare static readability; ensure primary navigation works before the intro resolves. Play/Pause/Skip on touch and desktop. Disable JS or block `scenes.css` / the diagram chunk: text, numerical readouts and evidence remain usable. | Owner-reported complete · 29 October 2026 |
| Analytical explanations | Owner can explain all three lenses and all six challenge responses. Distinguish duplicate events/orders, allocated/incremental revenue, cohort mix/rate, intervals/causality, missing labels/missing orders, and contribution/revenue in cost sensitivity. Confirm recommendation, uncertainty and next evidence agree. | Owner-reported complete · 29 October 2026 |
| Brief downloads / PDFs | Change investigation, challenge and assumptions; download the current HTML brief and compare it with the click-time state. Exercise attribution/cohort selection and cost/tracking sliders. Print to PDF: one readable page, no clipped sections, correct numbers/links. Download/open the separate default `decision-brief.pdf`; recognise it as a default snapshot. Check native handling on iOS/Android and Safari. | Owner-reported complete · 29 October 2026 |
| Approved resume | When supplied, verify exact approved identity, SHA-256 and size; review content, selectable text, reading order, PDF links and desktop/mobile native download. Current pending state must never advertise a resume download. Include the pending state in owner review until the approved PDF is supplied. | Blocked: approved PDF absent |
| Contact links | Confirm `yash.h2700@gmail.com`, LinkedIn, GitHub and portfolio belong to Yash and are appropriate to publish. Open mail composer to check address/subject, then cancel; no message is sent. Test profile links in a signed-out browser. | Owner-reported complete · 29 October 2026 |
| Recruiter-facing copy | Owner approves identity, primary CTA, touch Play choice, spelling and tone. In a short read, explain who Yash is and what to inspect. No fabricated tenure, qualifications, adoption, client outcome or AI quality claim. The role source and independent-project disclaimer are accurate. | Owner-reported complete · 29 October 2026 |
| Evidence access / boundaries | Signed out, open E01–E04 primary and secondary links and inspect their pinned revision. Synthetic challenge, public historical day, owner test events and deterministic/mocked evaluations remain distinct. Reconfirm intended location and application availability on the official listing before applying. | Owner-reported complete · 29 October 2026 |
| Build / automated checks | On the final approved commit: `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit --omit=dev`; check generated files and exact-head GitHub CI. These supplement manual review. Preserve prior performance evidence; no new score is implied by copy/doc changes. | See PR CI; final release SHA pending |

## Approval record

- Owner-accepted experience: **9e8e0f5**; final GitHub Pages configuration verification is recorded in the focused publishing PR.
- Manual checklist completed: **Owner-reported complete · 29 October 2026**
- Pending-resume state accepted with the owner’s release instruction on 29 October 2026. **Approved PDF still absent; no resume download is advertised.**
- Owner confirms contact details, copy and evidence explanations: **Owner-reported complete · 29 October 2026**
- Public release enables `index,follow` through `NEXT_PUBLIC_SITE_RELEASE=true`; local/review builds retain `noindex,nofollow`.
- Owner approves merging the publishing changes: **Authorized · 29 October 2026**; GitHub Pages changes require final automated verification.
- Owner approves public release and GitHub hosting/domain: **Authorized · 29 October 2026**. Making this repository public, including source/history: **explicitly authorized**. No paid upgrade requested.
- Repository publication: **public source/history explicitly approved · 29 October 2026**. No resume or credentials are fabricated.
- Production URL / deployed commit / deployment ID / smoke-check result: **Recorded in the GitHub Pages workflow/environment and the publishing PR after deployment verification**

Follow [the ordered deployment instructions](DEPLOYMENT.md) only after the relevant approvals are recorded. A successful build is not a merge or hosting authorization.
