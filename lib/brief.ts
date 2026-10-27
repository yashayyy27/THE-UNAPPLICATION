import {
  candidate,
  edition,
  artifact,
  paths,
  challenges,
  type PathId,
  type ChallengeId,
} from "../content/edition";
import { scenario } from "../content/scenario";
import {
  adjustedPurchases,
  breakEven,
  pct,
  rate,
  credit,
  type Attribution,
} from "./analytics";
export interface BriefState {
  path: PathId;
  challenge: ChallengeId;
  missing: number;
  cost: number;
  model?: Attribution;
  cohort?: string;
}
export function briefText(state: BriefState) {
  const path = paths.find((p) => p.id === state.path);
  const challenge = challenges.find((c) => c.id === state.challenge);
  if (!path || !challenge) throw new RangeError("Invalid brief selection");
  const adjusted = adjustedPurchases(100, state.missing);
  const hurdle = breakEven(state.cost);
  const model = state.model ?? "last";
  const allocations = credit(model);
  const cohort = scenario.cohorts.find((c) => c.id === (state.cohort ?? "all"));
  if (!cohort) throw new RangeError("Invalid cohort");
  const selectedDetail =
    state.path === "effectiveness"
      ? `Selected ${model === "linear" ? "linear" : model + "-touch"} credit: ${Object.entries(
          allocations,
        )
          .map(([name, value]) => `${name} USD ${value.toFixed(0)}`)
          .join("; ")}. Separate invented journeys; total USD 150.`
      : state.path === "behaviour"
        ? `Selected cohort: ${cohort.label}. Started sessions ${cohort.before[0]} to ${cohort.after[0]}; purchases ${cohort.before[4]} to ${cohort.after[4]}; conversion ${pct(rate(cohort.before[4], cohort.before[0]), 2)} to ${pct(rate(cohort.after[4], cohort.after[0]), 2)}.`
        : `120 raw purchase events, 20 duplicate firings, 100 distinct orders.`;
  return {
    path,
    challenge,
    selectedDetail,
    finding:
      "Engaged sessions: 2,000 → 3,300 (+65%). Purchases: 100 → 100. Revenue: USD 8,000 → USD 8,000. Observed session conversion: 2.00% → 1.33%.",
    recommendation: challenge.action,
    assumption: `If ${state.missing}% of true purchases were unobserved, the model implies ${adjusted.toFixed(1)} purchases and ${pct(rate(adjusted, 7500), 2)} conversion. This is sensitivity analysis, not recovered sales. At USD ${state.cost.toLocaleString("en-US")} cost and assumed USD 40 contribution per incremental order, break-even requires ${hurdle} incremental orders.`,
  };
}
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function briefHtml(state: BriefState) {
  const b = briefText(state);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Decision brief — THE UNAPPLICATION</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font:10.5px/1.4 Arial,sans-serif;color:#161813;max-width:720px;margin:32px auto;padding:0 24px}header{border-top:8px solid #171914;padding-top:16px;display:flex;justify-content:space-between}h1{font-size:32px;line-height:1.02;letter-spacing:-1.5px;margin:25px 0 10px}h2{font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:12px 0 5px}p{margin:5px 0}a{color:inherit}footer{border-top:1px solid #aaa;margin-top:18px;padding-top:12px;font-size:10px}.tag{background:#e0f49e;padding:4px 8px;display:inline-block}.note{color:#555}@media print{body{margin:0;padding:0}.print{display:none}}</style></head><body><header><strong>THE UNAPPLICATION</strong><span>${escapeHtml(candidate.name)} · ${escapeHtml(edition.company)} / ${edition.number}</span></header><h1>Attention is up.<br>What decision follows?</h1><p class="tag">SYNTHETIC SCENARIO · NOT CLIENT DATA · REVIEW DRAFT</p><h2>01 / Business question</h2><p>Why did a fictional commerce campaign record more engagement without more purchases? Two illustrative 14-day periods; currency USD.</p><h2>02 / Observed fixture</h2><p>${escapeHtml(b.finding)}</p><h2>03 / Investigation: ${escapeHtml(b.path.title)}</h2><p>${escapeHtml(b.path.interpretation)}</p><p>${escapeHtml(b.selectedDetail)}</p><h2>04 / Challenge: ${escapeHtml(b.challenge.title)}</h2><p><strong>Why it matters:</strong> ${escapeHtml(b.challenge.matters)}</p><p><strong>Revise:</strong> ${escapeHtml(b.challenge.revised)}</p><p><strong>Still supported:</strong> ${escapeHtml(b.challenge.supported)}</p><h2>05 / Recommended decision</h2><p>${escapeHtml(b.recommendation)}</p><p><strong>Evidence needed:</strong> ${escapeHtml(b.challenge.needed)}</p><h2>06 / Commercial and measurement assumptions</h2><p>${escapeHtml(b.assumption)}</p><p class="note">No uplift, client outcome or causal impact has been established. The fixture illustrates reasoning. Applicant review is still required.</p><h2>07 / Engineering proof, separate from this scenario</h2><p><a href="${artifact(b.path.sourcePath)}">Inspect the SQL/Python source</a> · <a href="${artifact("docs/verification.md")}">Read upstream verification and limits</a></p><footer>${escapeHtml(edition.disclaimer)}<br>${escapeHtml(candidate.email)} · github.com/yashayyy27 · Snapshot: ${escapeHtml(state.path)} / ${escapeHtml(state.challenge)} / missing ${state.missing}% / cost USD ${state.cost} / ${escapeHtml(state.model ?? "last")} / ${escapeHtml(state.cohort ?? "all")}</footer><p class="print">Use your browser’s Print → Save as PDF to keep this one-page brief.</p></body></html>`;
}
export function downloadBrief(state: BriefState) {
  const url = URL.createObjectURL(
    new Blob([briefHtml(state)], { type: "text/html;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "THE-UNAPPLICATION-decision-brief.html";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
