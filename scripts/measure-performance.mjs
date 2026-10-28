// Run in isolation, after browser tests, with both production exports served.
// Usage: CHROME_PATH=/path/to/chrome node scripts/measure-performance.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const destination =
  process.env.UNAPPLICATION_PERF_OUTPUT_DIR || "docs/cinematic-v2/performance";
mkdirSync(destination, { recursive: true });
const candidateOnly = process.argv.includes("--candidate-only");
const rounds = Number(process.env.UNAPPLICATION_PERF_ROUNDS || 3);
if (!Number.isInteger(rounds) || rounds < 3 || rounds > 7) throw new Error("Use 3–7 complete comparison rounds.");
const saveAssets = process.argv.includes("--save-assets");
const results = candidateOnly
  ? JSON.parse(
      readFileSync(`${destination}/summary.json`, "utf8"),
    ).results.filter((r) => r.version === "v1")
  : [];
for (let round = 1; round <= rounds; round++) {
  for (const [version, port] of candidateOnly
    ? [["v2", 4173]]
    : [
        ["v1", 4174],
        ["v2", 4173],
      ]) {
    const path = `${destination}/${version}-${round}.json`;
    execFileSync(
      process.execPath,
      [
        "node_modules/lighthouse/cli/index.js",
        `http://127.0.0.1:${port}`,
        "--output=json",
        `--output-path=${path}`,
        "--chrome-flags=--headless",
        "--quiet",
        ...(saveAssets ? ["--save-assets"] : []),
      ],
      { stdio: "inherit" },
    );
    const report = JSON.parse(readFileSync(path, "utf8"));
    const result = {
      version,
      round,
      benchmarkIndex: report.environment.benchmarkIndex,
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(
        report.categories["best-practices"].score * 100,
      ),
      seo: Math.round(report.categories.seo.score * 100),
      lcpMs: report.audits["largest-contentful-paint"].numericValue,
      tbtMs: report.audits["total-blocking-time"].numericValue,
      cls: report.audits["cumulative-layout-shift"].numericValue,
      transferBytes: report.audits["total-byte-weight"].numericValue,
    };
    results.push(result);
    console.log(JSON.stringify(result));
  }
}
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const medians = Object.fromEntries(
  ["v1", "v2"].map((version) => [
    version,
    Object.fromEntries(
      [
        "performance",
        "accessibility",
        "bestPractices",
        "seo",
        "lcpMs",
        "tbtMs",
        "cls",
        "transferBytes",
      ].map((key) => [
        key,
        median(results.filter((r) => r.version === version).map((r) => r[key])),
      ]),
    ),
  ]),
);
writeFileSync(
  `${destination}/summary.json`,
  JSON.stringify(
    {
      method:
        `${rounds} isolated alternating Lighthouse 13.5.0 default mobile runs per version. Same Chromium, machine, frozen production exports and uncompressed Python static-server settings. No concurrent tests, builds or active preview tabs. Fresh Chrome per run. Candidate-only mode, if selected, retains baseline runs and must not be described as a fresh paired comparison. Medians are descriptive local observations, not field Core Web Vitals.`,
      capturedAt: new Date().toISOString(),
      candidateOnly,
      rounds,
      results,
      medians,
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify({ medians }));
