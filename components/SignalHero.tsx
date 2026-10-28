"use client";
import { candidate, edition, openingEvidence, artifact } from "../content/edition";
import { scenario } from "../content/scenario";
import { pct, rate } from "../lib/analytics";
import { External } from "./Presentation";
import { useMotionSystem } from "./MotionSystem";
const signals = [
  `${scenario.after.engaged.toLocaleString("en-US")} engaged`,
  `${scenario.after.purchases} orders`,
  `USD ${scenario.after.revenue.toLocaleString("en-US")}`,
  `${scenario.after.sessions.toLocaleString("en-US")} sessions`,
  `${scenario.quality.purchaseEvents} event firings`,
  `${scenario.quality.duplicateFirings} duplicates`,
  `${pct(rate(scenario.before.purchases, scenario.before.sessions), 2)} → ${pct(rate(scenario.after.purchases, scenario.after.sessions), 2)}`,
  `${scenario.quality.missingCampaignOrders} unknown labels`,
];
export function SignalAperture() {
  const { phase } = useMotionSystem();
  return (
    <div className="signal-aperture" aria-hidden="true">
      <div className="aperture-canvas">
        <svg
          viewBox="0 0 1400 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            className="resolved-trace"
            d="M600 570L810 570L897 484L956 484L1024 415H1340"
            stroke="#d9ff43"
            strokeWidth="1.5"
          />

        </svg>
        <span className="decision-marker">DECISION / 001</span>
        <div className="signal-labels">
          {signals.map((text, i) => (
            <span className="signal-label" key={text} style={{
              left: `${(807 + (i % 3) * 180) / 14}%`,
              top: `${(192 + Math.floor(i / 3) * 165) / 8}%`,
              "--drift-x": `${(i % 2 ? 1 : -1) * (35 + i * 7)}px`,
              "--drift-y": `${((i % 3) - 1) * 35}px`,
            } as React.CSSProperties}><i />{text}</span>
          ))}
        </div>
      </div>
      <span className="aperture-index">FIG. 001 / SIGNAL APERTURE</span>
      <span className="aperture-state">
        {phase === "complete" ? "SIGNAL RESOLVED" : phase.toUpperCase()}
      </span>
    </div>
  );
}
export default function SignalHero() {
  const m = useMotionSystem();
  const active =
    m.phase === "noise"
      ? 0
      : m.phase === "sorting" || m.phase === "signal"
        ? 1
        : 2;
  return (
    <section
      className="hero cinematic-hero"
      id="hero-scene"
      aria-labelledby="hero-title"
    >
      <SignalAperture />
      <div className="hero-topline">
        <p className="eyebrow">INDEPENDENT THINKING. INSPECTABLE EVIDENCE.</p>
        <span className="mono">
          {edition.company} / DATA ANALYST / {edition.number}
        </span>
      </div>
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="hero-film-title">
            FROM NOISE <span>TO SIGNAL.</span>
          </p>
          <h1 id="hero-title">
            <span className="headline-first">DON’T INTERVIEW </span>
            <span className="headline-resume">MY RESUME. </span>
            <span className="headline-interview">INTERVIEW MY </span>
            <span className="headline-thinking">
              THINKING<span>.</span>
            </span>
          </h1>
          <div className="hero-description">
            <p className="hero-byline">
              {candidate.name} <span>/ {edition.role}</span>
            </p>
            <p>
              Sydney-based Business Analytics graduate.
              <br />
              SQL. Python. Commercial perspective.
            </p>
            <p className="hero-small">
              An independent application for {edition.company}.<br />
              Product, data analysis and restaurant operations experience.
            </p>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#brief" onClick={m.skip}>
              Put my thinking to the test <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-evidence" role="group" aria-label="Inspect technical evidence">
            {openingEvidence.map((item) => (
              <External key={item.label} href={artifact(item.path)}>{item.label}</External>
            ))}
          </div>
          <a className="hero-evidence-context" href="#proof">
            Code, public-data analysis and owner test receipts. Explore the evidence and limits ↗
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <div className="narrative-states" aria-label="Creative sequence">
          {["NOISE", "SIGNAL", "DECISION"].map((s, i) => (
            <span key={s} className={active === i ? "current" : ""}>
              <small>0{i + 1}</small>
              {s}
              <i aria-hidden="true" />
            </span>
          ))}
        </div>
        <div className="intro-controls">
          <span className="motion-note">
            {m.pending ? "Optional: play the 12-second story." : m.enabled
              ? m.phase === "complete"
                ? "A clear next move."
                : "An optional 12-second visual story."
              : m.reason}
          </span>
          <button
            onClick={m.pending ? m.start : m.skip}
            className="skip-intro"
            disabled={m.phase === "complete" && !m.pending}
          >
            {m.pending ? "Play cinematic introduction" : m.phase === "complete"
              ? "Introduction complete"
              : "Skip introduction"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <span className="hero-fixture-note">
        Motion uses illustrative fixture signals. No client data.
      </span>
    </section>
  );
}
