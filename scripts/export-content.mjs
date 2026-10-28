import "./compile-scenes.mjs";
// Node 24 can read these erasable TypeScript content files without a compiler.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { scenario } from "../content/scenario.ts";
import {
  evidence,
  selectedWork,
  sourceCommit,
  officialRole,
  artifact,
} from "../content/edition.ts";
import { verifyResume } from "./verify-resume.mjs";
const resumeApproval = JSON.parse(readFileSync(new URL("../content/resume.json", import.meta.url), "utf8")).approved;
console.log(verifyResume(resumeApproval));
mkdirSync("public", { recursive: true });
writeFileSync("public/scenario.json", JSON.stringify(scenario, null, 2) + "\n");
const manifest = {
  edition: "R/GA — 001",
  owner: "Yash Hurdale",
  auditedAt: "2026-10-29",
  officialRole,
  sourceRepository: "https://github.com/yashayyy27/exclamation-ai",
  sourceCommit,
  verificationBoundary:
    "Source and committed historical receipts inspected. Google account sessions were not independently reauthenticated. Historical upstream test counts are not new results for this application.",
  evidence: evidence.map((e) => ({
    ...e,
    url: artifact(e.path),
    secondaryUrl: artifact(e.secondary),
    classification:
      e.id === "E01"
        ? "B: locally reproducible source"
        : e.id === "E04"
          ? "B: reproducible deterministic adversarial test"
          : "A: working behaviour documented by upstream historical receipts",
  })),
  selectedWork: selectedWork.map((w) => ({
    ...w,
    classification:
      "README inspected; full implementation and outcomes not independently rerun",
  })),
  additionalClaims: [
    {
      claim: "Engaged sessions +65%, purchases and revenue unchanged",
      source: "scenario.json",
      classification: "Synthetic demonstration; not an achievement",
      calculation: "3300/2000-1; 100/100-1; 8000/8000-1",
    },
    {
      claim: "Attribution allocation changes without changing USD 150 total",
      source: "content/scenario.ts + lib/analytics.ts",
      classification:
        "Separate synthetic mini-fixture; unit and browser tested",
    },
    {
      claim:
        "72 Python, 50 frontend and 16 browser tests in upstream historical log",
      url: artifact("docs/verification.md"),
      classification: "Historical upstream counts, not rerun here",
    },
    {
      claim: "Email and LinkedIn contact",
      source: "https://yashayyy27.github.io/",
      classification:
        "Existing owner-published public contact; no private profile data used",
    },
    {
      claim: "Further portfolio work includes PULSE, RESTOPS and Apex Insights",
      source: "https://yashayyy27.github.io/",
      classification:
        "Public portfolio and project READMEs inspected. Implementations and outcomes not independently rerun.",
    },
    {
      claim:
        "R/GA public creative/technology positioning informs the experience",
      source: "https://www.rga.com/about",
      classification:
        "Official public source; design interpretation is independent",
    },
  ],
  unavailable: [
    "Vacancy availability at application time; recruiting confirmation of location/eligibility",
    ...(resumeApproval ? [] : ["Approved resume"]),
    "Independently verified credentials/employment",
    "Live model quality",
    "BigQuery SDK transport",
    "First daily export table",
    "Causal impact/client uplift",
  ],
  tests:
    "See docs/VERIFICATION.md for this application’s observed checks and limits.",
};
writeFileSync(
  "public/evidence-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
writeFileSync(
  "docs/EVIDENCE-MANIFEST.md",
  "# Evidence manifest\n\nMachine-readable source: [public/evidence-manifest.json](../public/evidence-manifest.json). All upstream artifact links are pinned to `" +
    sourceCommit +
    "`.\n\n" +
    evidence
      .map(
        (e) =>
          `## ${e.id} / ${e.title}\n\n${e.category}. ${e.description}\n\n[Primary artifact](${artifact(e.path)}) · [${e.secondaryLabel}](${artifact(e.secondary)})\n\nLimit: ${e.limitation}\n`,
      )
      .join("\n") +
    "\nThe current synthetic scenario and every sensitivity estimate are demonstrations, not professional achievements. See RESEARCH.md for classification A–E and factual gaps.\n",
);
console.log("Exported fixture and evidence manifest.");
