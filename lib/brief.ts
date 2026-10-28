import { candidate, edition, artifact } from "../content/edition";
import { briefText, type BriefState } from "./brief-model";
export { briefText, type BriefState } from "./brief-model";
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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Decision brief — THE UNAPPLICATION</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font:10.5px/1.4 Arial,sans-serif;color:#161813;max-width:720px;margin:32px auto;padding:0 24px}header{border-top:8px solid #171914;padding-top:16px;display:flex;justify-content:space-between}h1{font-size:32px;line-height:1.02;letter-spacing:-1.5px;margin:25px 0 10px}h2{font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:12px 0 5px}p{margin:5px 0}a{color:inherit}footer{border-top:1px solid #aaa;margin-top:18px;padding-top:12px;font-size:10px}.tag{background:#e0f49e;padding:4px 8px;display:inline-block}.note{color:#555}@media print{body{margin:0;padding:0}.print{display:none}}</style></head><body><header><strong>THE UNAPPLICATION</strong><span>${escapeHtml(candidate.name)} · ${escapeHtml(edition.company)} / ${edition.number}</span></header><h1>Attention is up.<br>What decision follows?</h1><p class="tag">SYNTHETIC SCENARIO · NOT CLIENT DATA</p><h2>01 / Business question</h2><p>Why did a fictional commerce campaign record more engagement without more purchases? Two illustrative 14-day periods; currency USD.</p><h2>02 / Observed fixture</h2><p>${escapeHtml(b.finding)}</p><h2>03 / Investigation: ${escapeHtml(b.path.title)}</h2><p>${escapeHtml(b.path.interpretation)}</p><p>${escapeHtml(b.selectedDetail)}</p><h2>04 / Challenge: ${escapeHtml(b.challenge.title)}</h2><p><strong>Why it matters:</strong> ${escapeHtml(b.challenge.matters)}</p><p><strong>Revise:</strong> ${escapeHtml(b.challenge.revised)}</p><p><strong>Still supported:</strong> ${escapeHtml(b.challenge.supported)}</p><h2>05 / Recommended decision</h2><p>${escapeHtml(b.recommendation)}</p><p><strong>Evidence needed:</strong> ${escapeHtml(b.challenge.needed)}</p><h2>06 / Commercial and measurement assumptions</h2><p>${escapeHtml(b.assumption)}</p><p class="note">No uplift, client outcome or causal impact has been established. The fixture illustrates reasoning.</p><h2>07 / Engineering proof, separate from this scenario</h2><p><a href="${artifact(b.path.sourcePath)}">Inspect the SQL/Python source</a> · <a href="${artifact("docs/verification.md")}">Read upstream verification and limits</a></p><footer>${escapeHtml(edition.disclaimer)}<br>${escapeHtml(candidate.email)} · github.com/yashayyy27 · Snapshot: ${escapeHtml(state.path)} / ${escapeHtml(state.challenge)} / missing ${state.missing}% / cost USD ${state.cost} / ${escapeHtml(state.model ?? "last")} / ${escapeHtml(state.cohort ?? "all")}</footer><p class="print">Use your browser’s Print → Save as PDF to keep this one-page brief.</p></body></html>`;
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
