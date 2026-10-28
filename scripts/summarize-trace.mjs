// Usage: node scripts/summarize-trace.mjs /path/to/report-prefix
// Lighthouse --save-assets writes prefix.json and prefix-0.trace.json.
import { readFileSync } from "node:fs";
const prefix = process.argv[2];
if (!prefix) throw new Error("Supply the Lighthouse report prefix.");
const report = JSON.parse(readFileSync(`${prefix}.json`, "utf8"));
const events = JSON.parse(readFileSync(`${prefix}-0.trace.json`, "utf8")).traceEvents;
const threads = events.filter(e => e.name === "thread_name" && e.args?.name === "CrRendererMain").map(t => {
  const entries = events.filter(e => e.pid === t.pid && e.tid === t.tid && e.ph === "X");
  return { entries, layout: entries.filter(e => e.name === "Layout").reduce((s, e) => s + e.dur, 0) };
}).sort((a, b) => b.layout - a.layout);
const entries = threads[0].entries;
const largestLayout = entries.filter(e => e.name === "Layout").sort((a,b) => b.dur-a.dur)[0];
const timings = Object.fromEntries(["Layout", "UpdateLayoutTree", "Paint", "PrePaint", "Layerize", "EvaluateScript"].map(name => {
  const matching = entries.filter(e => e.name === name);
  return [name, { count: matching.length, totalMs: Number((matching.reduce((sum,e) => sum+e.dur,0)/1000).toFixed(3)) }];
}));
console.log(JSON.stringify({
  fetchedAt: report.fetchTime,
  lighthouse: report.lighthouseVersion,
  settings: { formFactor: report.configSettings.formFactor, throttlingMethod: report.configSettings.throttlingMethod, throttling: report.configSettings.throttling },
  performance: report.categories.performance.score * 100,
  lcpMs: report.audits["largest-contentful-paint"].numericValue,
  tbtMs: report.audits["total-blocking-time"].numericValue,
  lcpElement: report.audits["lcp-breakdown-insight"]?.details?.items?.find(i => i.type === "node")?.selector,
  traceNote: "Raw recorded renderer timings below are unthrottled observed milliseconds, not additive across nested categories and not the simulated Lighthouse metrics above.",
  timings,
  largestLayout: { ms: largestLayout.dur/1000, dirtyObjects: largestLayout.args?.beginData?.dirtyObjects, totalObjects: largestLayout.args?.beginData?.totalObjects },
  lighthouseMainThread: report.audits["mainthread-work-breakdown"].details.items,
  renderBlocking: report.audits["render-blocking-insight"]?.details?.items,
  nonCompositedAnimations: report.audits["non-composited-animations"]?.details?.items?.map(i => ({ node: i.node?.selector, reasons: i.subItems?.items })),
},null,2));
