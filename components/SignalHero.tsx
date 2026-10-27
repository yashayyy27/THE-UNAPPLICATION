"use client";
import { candidate, edition } from "../content/edition";
import { scenario } from "../content/scenario";
import { pct, rate } from "../lib/analytics";
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
          <defs>
            <linearGradient
              id="ribbon"
              x1="500"
              y1="100"
              x2="1250"
              y2="700"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#e2ff56" />
              <stop offset=".5" stopColor="#a0b749" />
              <stop offset="1" stopColor="#54652d" />
            </linearGradient>
            <radialGradient id="halo">
              <stop stopColor="#cfff3c" stopOpacity=".13" />
              <stop offset="1" stopColor="#cfff3c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="1030" cy="405" rx="500" ry="390" fill="url(#halo)" />
          <g className="aperture-ribbons">
            {Array.from({ length: 22 }, (_, i) => (
              <ellipse
                key={i}
                cx={1008 + i * 2}
                cy={Number((390 + i * 1.6).toFixed(1))}
                rx={174 + i * 9}
                ry={50 + i * 9}
                transform={`rotate(${(-37 + i * 0.65).toFixed(2)} ${1008 + i * 2} ${(390 + i * 1.6).toFixed(1)})`}
                stroke="url(#ribbon)"
                strokeWidth={i % 7 === 0 ? 1.4 : 0.65}
                opacity={0.28 + i / 45}
              />
            ))}
          </g>
          <g className="signal-orbits">
            <ellipse
              cx="1065"
              cy="415"
              rx="310"
              ry="310"
              stroke="#c8dc8c"
              strokeOpacity=".12"
              strokeDasharray="2 12"
            />
            <path
              d="M650 720L1320 87M670 145L1315 665M760 415H1380"
              stroke="#b5cc74"
              strokeOpacity=".2"
            />
            <circle cx="1065" cy="415" r="9" fill="#d9ff43" />
            <circle
              cx="1065"
              cy="415"
              r="22"
              stroke="#d9ff43"
              strokeOpacity=".5"
            />
          </g>
          <g className="signal-dots">
            {[false, true].map((bright) => (
              <path
                key={String(bright)}
                fill={bright ? "#e2ff56" : "#7b8659"}
                d={Array.from({ length: 56 }, (_, i) => {
                  if ((i % 8 === 0) !== bright) return "";
                  const a = i * 2.39996,
                    r = 65 + ((i * 47) % 320),
                    cx = 1065 + Math.cos(a) * r,
                    cy = 415 + Math.sin(a) * r * 0.75,
                    s = bright ? 2.7 : 1;
                  return `M${(cx - s).toFixed(1)} ${cy.toFixed(1)}a${s} ${s} 0 1 0 ${s * 2} 0a${s} ${s} 0 1 0 -${s * 2} 0`;
                }).join("")}
              />
            ))}
          </g>
          <g className="signal-labels">
            {signals.map((text, i) => (
              <g
                className={`signal-label signal-label-${i}`}
                key={text}
                style={
                  {
                    "--drift-x": `${(i % 2 ? 1 : -1) * (35 + i * 7)}px`,
                    "--drift-y": `${((i % 3) - 1) * 35}px`,
                  } as React.CSSProperties
                }
              >
                <path
                  d={`M${770 + (i % 3) * 180} ${196 + Math.floor(i / 3) * 165}h28`}
                  stroke="#adc660"
                />
                <text
                  x={807 + (i % 3) * 180}
                  y={200 + Math.floor(i / 3) * 165}
                  fill="#c4cbae"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {text}
                </text>
              </g>
            ))}
          </g>
          <path
            className="resolved-trace"
            d="M600 570L810 570L897 484L956 484L1024 415H1340"
            stroke="#d9ff43"
            strokeWidth="1.5"
          />
          <text
            x="1230"
            y="445"
            fill="#d9ff43"
            fontSize="10"
            fontFamily="monospace"
          >
            DECISION / 001
          </text>
        </svg>
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
              Anyone can show you a result.
              <br />
              I’ll show you what I would question.
            </p>
            <p className="hero-small">
              An independent application for {edition.company}.<br />
              One business problem. Three lenses. Evidence you can challenge.
            </p>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#brief" onClick={m.skip}>
              Put my thinking to the test <span aria-hidden="true">↗</span>
            </a>
            <a className="subtle-link" href="#proof">
              Explore the evidence <span aria-hidden="true">↗</span>
            </a>
          </div>
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
            {m.enabled
              ? m.phase === "complete"
                ? "A clear next move."
                : "An optional 12-second visual story."
              : m.reason}
          </span>
          <button
            onClick={m.skip}
            className="skip-intro"
            disabled={m.phase === "complete"}
          >
            {m.phase === "complete"
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
