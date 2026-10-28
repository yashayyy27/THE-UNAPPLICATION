"use client";
import { lazy, useRef, useState } from "react";
import StaticEvidence from "./StaticEvidence";
import SignalHero from "./SignalHero";
import { MotionSystem, MotionControl } from "./MotionSystem";
import { Arrow, External, Chapter } from "./Presentation";
import { ViewportVisual } from "./ViewportVisual";
import { ContradictionTrace } from "./ContradictionTrace";
// Diagram code and DOM load near their scene; numerical readouts are never deferred.
const MeasurementVisual = lazy(() => import("./AnalyticalVisuals").then(m => ({ default: m.MeasurementVisual })));
const AttributionVisual = lazy(() => import("./AnalyticalVisuals").then(m => ({ default: m.AttributionVisual })));
const CohortVisual = lazy(() => import("./AnalyticalVisuals").then(m => ({ default: m.CohortVisual })));
const ChallengeSignal = lazy(() => import("./AnalyticalVisuals").then(m => ({ default: m.ChallengeSignal })));
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
  change,
  credit,
  pct,
  rate,
  wilson,
  type Attribution,
} from "../lib/analytics";
import { briefText } from "../lib/brief-model";
let briefExporter: Promise<typeof import("../lib/brief")> | undefined;
const loadBriefExporter = () => briefExporter ??= import("../lib/brief").catch(error => {
  briefExporter = undefined;
  throw error;
});
const warmBriefExporter = () => { void loadBriefExporter().catch(() => {}); };

const hero = <SignalHero />;
function ExperienceContent() {
  const [pathId, setPathId] = useState<PathId>("measurement");
  const [challengeId, setChallengeId] = useState<ChallengeId>("tracking");
  const [missing, setMissing] = useState(0);
  const [model, setModel] = useState<Attribution>("last");
  const [cohortId, setCohortId] = useState("all");
  const [cost, setCost] = useState(1000);
  const [exported, setExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const selectionRevision = useRef(0);
  const path = paths.find((p) => p.id === pathId)!;
  const challenge = challenges.find((c) => c.id === challengeId)!;
  const cohort = scenario.cohorts.find((c) => c.id === cohortId)!;
  const adjusted = adjustedPurchases(100, missing);
  const allocations = credit(model);
  const interval = wilson(100, 7500)!;
  const briefState = {
    path: pathId,
    challenge: challengeId,
    missing,
    cost,
    model,
    cohort: cohortId,
  };
  const brief = briefText(briefState);
  const markChanged = () => {
    selectionRevision.current++;
    setExported(false);
    setExportError(false);
  };
  const code =
    pathId === "measurement"
      ? `-- Transaction grain, not event count\nSELECT COUNT(DISTINCT transaction_id)\n  AS unique_orders\nFROM clean_purchase_events\nWHERE transaction_id IS NOT NULL;`
      : pathId === "effectiveness"
        ? `# Descriptive uncertainty, not causal proof\ninterval = wilson(successes=100, total=7500)\n# Credit allocations sum to the same revenue.\n# Missing spend + counterfactual → no ROAS.\nrecommendation = "validate before reallocating"`
        : `-- Ordered session funnel, simplified\nSELECT session_key, started, viewed,\n       carted, checked, purchased\nFROM ordered_sessions;\n-- Each stage must follow its predecessor.`;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the experience
      </a>
      <header className="site-header">
        <a className="wordmark" href="#main">
          <span className="brand-symbol" aria-hidden="true">
            U<span>↗</span>
          </span>
          <span>
            THE
            <br /> UNAPPLICATION
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#red-team">The challenge</a>
          <a href="#investigation">Investigation</a>
          <a href="#proof">Evidence</a>
          <a href="#resume">Resume</a>
          <a className="nav-contact" href="#contact">
            Contact <Arrow diagonal />
          </a>
        </nav>
        <MotionControl />
        <span className="edition-tag">
          {edition.company} — {edition.number}
        </span>
      </header>
      <main id="main">
        {hero}
        <Chapter id="brief" number="01" title="THE BUSINESS PROBLEM">
          <div className="section-heading">
            <h2 id="brief-heading">
              Good numbers.
              <br />
              <span className="muted">Wrong conclusion?</span>
            </h2>
            <div className="section-intro">
              <span className="badge">SYNTHETIC SCENARIO</span>
              <p>
                A fictional commerce campaign is getting more attention. Revenue
                hasn’t moved. Before celebrating the campaign—or blaming the
                checkout—where would you look?
              </p>
            </div>
          </div>
          <ContradictionTrace />
          <div className="metrics">
            <div className="metric">
              <span className="mono">ENGAGED SESSIONS</span>
              <strong>
                +
                {(
                  change(scenario.before.engaged, scenario.after.engaged)! * 100
                ).toFixed(0)}
                <span>%</span>
              </strong>
              <div className="metric-track">
                <i style={{ width: "61%" }} />
                <i style={{ width: "100%" }} />
              </div>
              <p>
                2,000 <Arrow /> 3,300
              </p>
            </div>
            <div className="metric">
              <span className="mono">PURCHASES</span>
              <strong>
                0<span>%</span>
              </strong>
              <div className="metric-track">
                <i style={{ width: "74%" }} />
                <i style={{ width: "74%" }} />
              </div>
              <p>
                100 <Arrow /> 100 distinct orders
              </p>
            </div>
            <div className="metric">
              <span className="mono">REVENUE</span>
              <strong>
                0<span>%</span>
              </strong>
              <div className="metric-track">
                <i style={{ width: "74%" }} />
                <i style={{ width: "74%" }} />
              </div>
              <p>
                USD 8,000 <Arrow /> USD 8,000
              </p>
            </div>
          </div>
          <div className="data-note">
            <span className="tiny-square" />
            <p>
              {scenario.description} All figures are invented. Two equal 14-day
              windows; sessions 5,000 → 7,500.{" "}
              <a href="./scenario.json" download>
                Inspect the fixture ↗
              </a>
            </p>
          </div>
          <a className="next-link" href="#investigation">
            Choose where to look <Arrow />
          </a>
        </Chapter>
        <Chapter id="investigation" number="02" title="THE INVESTIGATION">
          <div className="section-heading">
            <h2 id="investigation-heading">
              Three questions.
              <br />
              <span className="muted">Three different lenses.</span>
            </h2>
            <p className="section-intro">
              Select a line of inquiry. The data, interpretation and evidence
              change with your choice.
            </p>
          </div>
          <div
            className="path-selector"
            role="group"
            aria-label="Investigation path"
          >
            {paths.map((p) => (
              <button
                key={p.id}
                className={`path-button ${pathId === p.id ? "selected" : ""}`}
                aria-pressed={pathId === p.id}
                onClick={() => {
                  setPathId(p.id);
                  markChanged();
                }}
              >
                <span className="path-letter">{p.letter}</span>
                <span>
                  <strong>{p.title}</strong>
                  <small>{p.question}</small>
                </span>
                <Arrow diagonal />
              </button>
            ))}
          </div>
          <div
            className="investigation-panel"
            aria-live="polite"
            aria-atomic="true"
            id="investigation-result"
          >
            <div className="panel-copy">
              <p className="eyebrow">
                {path.letter} / {path.deck}
              </p>
              <h3>{path.finding}</h3>
              <p>{path.interpretation}</p>
              <div className="finding-callout">
                <span className="mono">MY NEXT MOVE</span>
                <p>{path.recommendation}</p>
              </div>
            </div>
            <div className="panel-data">
              {pathId === "measurement" && (
                <>
                  <div className="data-card-heading">
                    <span className="mono">PURCHASE RECONCILIATION</span>
                    <span className="badge subtle">ILLUSTRATIVE</span>
                  </div>
                  <ViewportVisual kind="measurement">
                    <MeasurementVisual missing={missing} />
                  </ViewportVisual>
                  <div className="reconciliation">
                    <div>
                      <strong>120</strong>
                      <span>raw event firings</span>
                    </div>
                    <span className="math-symbol">−</span>
                    <div>
                      <strong>20</strong>
                      <span>duplicate firings</span>
                    </div>
                    <span className="math-symbol">=</span>
                    <div className="result-number">
                      <strong>100</strong>
                      <span>unique orders</span>
                    </div>
                  </div>
                  <label className="control-label" htmlFor="missing-rate">
                    What if purchases are missing?<output>{missing}%</output>
                  </label>
                  <input
                    id="missing-rate"
                    type="range"
                    min="0"
                    max="30"
                    step="5"
                    value={missing}
                    onChange={(e) => {
                      setMissing(Number(e.target.value));
                      markChanged();
                    }}
                  />
                  <p className="calculation">
                    <strong>{adjusted.toFixed(1)}</strong> modelled purchases ·{" "}
                    <strong>{pct(rate(adjusted, 7500), 2)}</strong> conversion
                  </p>
                  <p className="fine-print">
                    Observed / (1 − missing fraction). Assumes uniform
                    missingness. This does not recover actual orders or prove
                    tracking failed.
                  </p>
                </>
              )}
              {pathId === "effectiveness" && (
                <>
                  <div className="data-card-heading">
                    <span className="mono">WHO GETS THE CREDIT?</span>
                    <span className="badge subtle">SEPARATE MINI-FIXTURE</span>
                  </div>
                  <label className="select-label" htmlFor="credit-model">
                    Attribution rule
                    <select
                      id="credit-model"
                      value={model}
                      onChange={(e) => {
                        setModel(e.target.value as Attribution);
                        markChanged();
                      }}
                    >
                      <option value="first">First touch</option>
                      <option value="last">Last touch</option>
                      <option value="linear">Linear</option>
                    </select>
                  </label>
                  <ViewportVisual kind="attribution">
                    <AttributionVisual allocations={allocations} />
                  </ViewportVisual>
                  <div className="credit-chart">
                    {Object.entries(allocations).map(([name, value]) => (
                      <div key={name}>
                        <span>{name}</span>
                        <div className="credit-track">
                          <i style={{ width: `${(value / 150) * 100}%` }} />
                        </div>
                        <strong>${value.toFixed(0)}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="calculation">
                    Same journeys. Same <strong>USD 150</strong>. Different
                    allocation.
                  </p>
                  <p className="fine-print">
                    A: Email → Organic, $100. B: Paid search → Organic, $50. C:
                    Paid search, $0. Invented complete same-device journeys; no
                    spend or counterfactual.
                  </p>
                </>
              )}
              {pathId === "behaviour" && (
                <>
                  <div className="data-card-heading">
                    <span className="mono">AN AVERAGE HIDES THE MIX</span>
                    <span className="badge subtle">ILLUSTRATIVE</span>
                  </div>
                  <label className="select-label" htmlFor="cohort">
                    Visitor cohort
                    <select
                      id="cohort"
                      value={cohortId}
                      onChange={(e) => {
                        setCohortId(e.target.value);
                        markChanged();
                      }}
                    >
                      {scenario.cohorts.map((c) => (
                        <option value={c.id} key={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ViewportVisual kind="cohort">
                    <CohortVisual cohort={cohort} />
                  </ViewportVisual>
                  <div
                    className="funnel"
                    role="img"
                    aria-label={`${cohort.label}, period two ordered funnel: ${cohort.after.join(", ")}`}
                  >
                    {[
                      "Sessions",
                      "Product views",
                      "Carts",
                      "Checkouts",
                      "Purchases",
                    ].map((name, i) => (
                      <div key={name}>
                        <span>{name}</span>
                        <div className="funnel-track">
                          <i
                            style={{
                              width: `${Math.max(2, (cohort.after[i] / cohort.after[0]) * 100)}%`,
                            }}
                          />
                        </div>
                        <strong>
                          {cohort.after[i].toLocaleString("en-US")}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <p className="calculation">
                    Conversion:{" "}
                    <strong>
                      {pct(rate(cohort.before[4], cohort.before[0]), 2)} →{" "}
                      {pct(rate(cohort.after[4], cohort.after[0]), 2)}
                    </strong>
                  </p>
                  <p className="fine-print">
                    Closed, ordered session funnel. Rates use started sessions
                    in the selected cohort. Counts describe the fixture; they do
                    not identify why intent changed.
                  </p>
                </>
              )}
            </div>
          </div>
          <p className="limitation">
            <span className="mono">THE LIMIT</span> {path.limitation}
          </p>
          <a className="next-link" href="#red-team">
            Challenge this interpretation <Arrow />
          </a>
        </Chapter>
        <Chapter id="engine" number="03" title="THE ANALYTICAL ENGINE">
          <div className="engine-layout">
            <div>
              <h2 id="engine-heading">
                A conclusion is only
                <br />
                as good as its <span className="accent">lineage.</span>
              </h2>
              <p className="engine-lede">
                The interactive story is the front door.
                <br />
                <strong>Exclamation AI is the engineering underneath.</strong>
              </p>
              <p className="muted-text">
                Keep the evidence inspectable: defined grains, ordered
                transformations, bounded claims. This excerpt changes with your
                investigation.
              </p>
              <External
                href={artifact(path.sourcePath)}
                className="subtle-link"
              >
                Inspect the original{" "}
                {path.sourcePath.endsWith(".sql") ? "SQL" : "Python"} artifact
              </External>
            </div>
            <div className="code-panel">
              <div className="code-topline">
                <span>
                  <i /> {path.sourcePath.endsWith(".sql") ? "SQL" : "PYTHON"} /
                  SIMPLIFIED EXPLANATION
                </span>
                <span>{path.evidenceId}</span>
              </div>
              <pre tabIndex={0} aria-label="Simplified analytical logic">
                <code>{code}</code>
              </pre>
              <div className="code-bottomline">
                Illustrative excerpt. Exact implementation at the linked source.
              </div>
            </div>
          </div>
          <div className="lineage">
            <div>
              <span>01 / INPUT</span>
              <p>Explicitly labelled fixture</p>
            </div>
            <Arrow />
            <div>
              <span>02 / TRANSFORM</span>
              <p>Deterministic, tested logic</p>
            </div>
            <Arrow />
            <div>
              <span>03 / INTERPRET</span>
              <p>Assumptions stay visible</p>
            </div>
            <Arrow />
            <div>
              <span>04 / DECIDE</span>
              <p>Evidence before action</p>
            </div>
          </div>
        </Chapter>
        <Chapter
          id="red-team"
          number="04"
          title="THE RED TEAM CHALLENGE"
          className="red-team"
        >
          <div className="section-heading">
            <h2 id="red-team-heading">
              Find a weakness
              <br />
              in my <span className="outline-text">analysis.</span>
            </h2>
            <p className="section-intro">
              Good analysis survives scrutiny.
              <br />
              Better analysis changes when it should.
              <br />
              Choose a challenge.
            </p>
          </div>
          <div className="red-team-layout">
            <div
              className="challenge-list"
              role="group"
              aria-label="Challenge an assumption"
            >
              {challenges.map((c, i) => (
                <button
                  key={c.id}
                  aria-pressed={challengeId === c.id}
                  className={challengeId === c.id ? "active" : ""}
                  onClick={() => {
                    setChallengeId(c.id);
                    markChanged();
                  }}
                >
                  <span className="mono">0{i + 1}</span>
                  <span>{c.title}</span>
                  <Arrow />
                </button>
              ))}
            </div>
            <div
              className="challenge-response"
              aria-live="polite"
              aria-atomic="true"
            >
              <ViewportVisual kind="challenge"><ChallengeSignal id={challengeId} cost={cost} /></ViewportVisual>
              <p className="eyebrow">
                CHALLENGE ACCEPTED / {challenge.short.toUpperCase()}
              </p>
              <h3>{challenge.matters}</h3>
              <dl>
                <div>
                  <dt>Still supported</dt>
                  <dd>{challenge.supported}</dd>
                </div>
                <div>
                  <dt>What I’d revise</dt>
                  <dd>{challenge.revised}</dd>
                </div>
                <div>
                  <dt>Evidence I need</dt>
                  <dd>{challenge.needed}</dd>
                </div>
              </dl>
              {challengeId === "sample" && (
                <p className="calculation">
                  After-period Wilson 95% interval:{" "}
                  <strong>
                    {pct(interval[0], 2)}–{pct(interval[1], 2)}
                  </strong>
                  . Assumes independent sessions; not a causal estimate.
                </p>
              )}
              {challengeId === "cost" && (
                <div className="cost-control">
                  <label className="control-label" htmlFor="delivery-cost">
                    Illustrative delivery cost
                    <output>USD {cost.toLocaleString("en-US")}</output>
                  </label>
                  <input
                    id="delivery-cost"
                    type="range"
                    min="0"
                    max="10000"
                    step="250"
                    value={cost}
                    onChange={(e) => {
                      setCost(Number(e.target.value));
                      markChanged();
                    }}
                  />
                  <p className="calculation">
                    <strong>{breakEven(cost)}</strong> incremental orders to
                    break even at assumed $40 contribution/order. Not a
                    forecast.
                  </p>
                </div>
              )}
              <div className="revised-action">
                <span className="mono">THE DECISION CHANGES</span>
                <p>{challenge.action}</p>
              </div>
            </div>
          </div>
          <a className="next-link" href="#decision">
            Take this challenge into the decision <Arrow />
          </a>
        </Chapter>
        <Chapter id="decision" number="05" title="THE EXECUTIVE DECISION">
          <div className="decision-layout">
            <div className="decision-title">
              <p className="eyebrow">A RECOMMENDATION YOU CAN USE</p>
              <h2 id="decision-heading">
                The next move.
                <br />
                <span className="muted">Not the biggest claim.</span>
              </h2>
              <p>
                Attention is up. Revenue is flat. The useful output is a
                defensible next step, with the uncertainty attached.
              </p>
              <span className="badge">SYNTHETIC SCENARIO / NOT CLIENT DATA</span>
            </div>
            <div className="decision-card">
              <div className="decision-card-top">
                <span className="mono">DECISION BRIEF / {edition.number}</span>
                <span className="mono">YH ↗</span>
              </div>
              <h3>{brief.recommendation}</h3>
              <dl>
                <div>
                  <dt>The problem</dt>
                  <dd>
                    Engagement rises 65%; purchases and revenue stay flat in an
                    illustrative campaign.
                  </dd>
                </div>
                <div>
                  <dt>The finding</dt>
                  <dd>{brief.selectedDetail}</dd>
                </div>
                <div>
                  <dt>Still uncertain</dt>
                  <dd>{challenge.revised}</dd>
                </div>
                <div>
                  <dt>The lens</dt>
                  <dd>{path.title}</dd>
                </div>
                <div>
                  <dt>The challenge</dt>
                  <dd>{challenge.short}</dd>
                </div>
                <div>
                  <dt>Validate next</dt>
                  <dd>{challenge.needed}</dd>
                </div>
                <div>
                  <dt>Business relevance</dt>
                  <dd>
                    Reduce the risk of funding the wrong fix. No revenue uplift
                    or causal impact has been established.
                  </dd>
                </div>
              </dl>
              <button
                className="button primary"
                disabled={exporting}
                onPointerEnter={warmBriefExporter}
                onFocus={warmBriefExporter}
                onClick={async () => {
                  const selection = { ...briefState };
                  const revision = selectionRevision.current;
                  setExporting(true);
                  setExportError(false);
                  try {
                    const { downloadBrief } = await loadBriefExporter();
                    downloadBrief(selection);
                    if (revision === selectionRevision.current) setExported(true);
                  } catch {
                    setExportError(true);
                  } finally { setExporting(false); }
                }}
              >
                {exporting ? "Preparing your brief…" : "Download your decision brief"} <span aria-hidden="true">↓</span>
              </button>
              <p className="fine-print" role="status">
                {exporting ? "Preparing the brief for your selected analysis…" : exportError ? "Couldn’t prepare the brief. Retry, or use the default PDF below." : exported
                  ? "Downloaded: your selected path, challenge and assumptions. Open the HTML brief to print or save as PDF."
                  : "One-page HTML · current selections included · print to PDF"}
              </p>
              <a className="small-link" href="./decision-brief.pdf" download>
                Or download the default PDF brief ↗
              </a>
            </div>
          </div>
        </Chapter>
        <StaticEvidence />
      </main>
      <footer className="site-footer">
        <span>
          © {new Date().getFullYear()} {candidate.name}
        </span>
        <p>{edition.disclaimer}</p>
        <a href="#main">Back to the question ↑</a>
      </footer>
    </>
  );
}

export default function Unapplication() {
  return (
    <MotionSystem>
      <ExperienceContent />
    </MotionSystem>
  );
}
