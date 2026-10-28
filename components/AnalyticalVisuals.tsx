"use client";
import { scenario } from "../content/scenario";
import { breakEven } from "../lib/analytics";
import type { ChallengeId } from "../content/edition";
export function MeasurementVisual({ missing }: { missing: number }) {
  return (
    <div className="measurement-visual" data-testid="measurement-visual">
      <svg
        viewBox="0 0 480 160"
        role="img"
        aria-label="120 recorded purchase firings separate into 100 unique orders and 20 duplicates. Missingness is a separate hypothetical assumption."
      >
        <g className="transaction-grid">
          {[
            { kind: "unique", count: scenario.quality.uniqueOrders },
            { kind: "duplicate", count: scenario.quality.duplicateFirings },
          ].map(({ kind, count }) => (
            <path
              key={kind}
              data-event-kind={kind}
              data-count={count}
              className={
                kind === "duplicate" ? "duplicate-token" : "order-token"
              }
              style={
                {
                  "--token-shift": kind === "duplicate" ? "-64px" : "0px",
                } as React.CSSProperties
              }
              d={Array.from({ length: count }, (_, j) => {
                const x =
                    kind === "duplicate"
                      ? 345 + (j % 5) * 19
                      : 22 + (j % 20) * 13,
                  y =
                    kind === "duplicate"
                      ? 31 + Math.floor(j / 5) * 19
                      : 30 + Math.floor(j / 20) * 19;
                return `M${x} ${y}h${kind === "duplicate" ? 9 : 5}v9h-${kind === "duplicate" ? 9 : 5}z`;
              }).join("")}
            />
          ))}
        </g>
        <path d="M309 20v106" stroke="#686f53" strokeDasharray="2 5" />
        <text x="20" y="145">
          UNIQUE TRANSACTIONS
        </text>
        <text x="343" y="145">
          DUPLICATES
        </text>
      </svg>
      <div className="missingness-indicator">
        <span>HYPOTHETICAL MISSINGNESS</span>
        <i style={{ width: `${(missing / 30) * 100}%` }} />
        <output>{missing}%</output>
      </div>
    </div>
  );
}
export function AttributionVisual({
  allocations,
}: {
  allocations: Record<string, number>;
}) {
  return (
    <svg
      className="attribution-visual"
      viewBox="0 0 480 180"
      role="img"
      aria-label={`Allocated credit: ${Object.entries(allocations)
        .map(([name, value]) => `${name} ${value} USD`)
        .join(", ")}. Total 150 USD in all models.`}
    >
      {Object.entries(allocations).map(([name, value], i) => (
        <g key={name} data-channel={name} data-credit={value}>
          <path
            className="flow-guide"
            d={`M115 ${30 + i * 60}C250 ${30 + i * 60} 260 90 378 90`}
          />
          {value > 0 && (
            <path
              className="credit-flow"
              d={`M115 ${30 + i * 60}C250 ${30 + i * 60} 260 90 378 90`}
              strokeWidth={(value / 150) * 26 + 1}
              opacity={0.45 + i * 0.2}
            />
          )}
          <text x="4" y={34 + i * 60}>
            {name.toUpperCase()}
          </text>
          <circle
            cx="112"
            cy={30 + i * 60}
            r={value ? 4 : 2}
            fill={value ? "#d9ff43" : "#737968"}
          />
        </g>
      ))}
      <circle cx="401" cy="90" r="25" fill="#d9ff43" />
      <text className="flow-total" x="401" y="88" textAnchor="middle">
        150
      </text>
      <text className="flow-total-unit" x="401" y="100" textAnchor="middle">
        USD
      </text>
      <text x="365" y="148">
        SAME REVENUE
      </text>
    </svg>
  );
}
export function CohortVisual({
  cohort,
}: {
  cohort: (typeof scenario.cohorts)[number];
}) {
  const before = cohort.before,
    after = cohort.after;
  return (
    <svg
      className="cohort-visual"
      viewBox="0 0 480 170"
      aria-hidden="true"
      aria-label={`${cohort.label}: started sessions ${before[0]} before and ${after[0]} after; purchases ${before[4]} before and ${after[4]} after. Width represents session volume relative to all after-period sessions.`}
    >
      <text x="15" y="20">
        STARTED SESSIONS
      </text>
      <text x="334" y="20">
        ORDERED PURCHASES
      </text>
      {[before, after].map((values, i) => {
        const y = 65 + i * 65,
          w = (values[0] / 7500) * 34;
        return (
          <g
            key={i}
            data-period={i ? "after" : "before"}
            data-sessions={values[0]}
            data-purchases={values[4]}
          >
            <path
              className="cohort-band"
              d={`M100 ${y - w / 2}C210 ${y - w / 2} 245 ${y - ((values[4] / 7500) * 34) / 2} 340 ${y - ((values[4] / 7500) * 34) / 2}L340 ${y + ((values[4] / 7500) * 34) / 2}C245 ${y + ((values[4] / 7500) * 34) / 2} 210 ${y + w / 2} 100 ${y + w / 2}Z`}
            />
            <path
              className="cohort-remainder"
              d={`M100 ${y}C220 ${y} 210 ${y + 20} 280 ${y + 20}`}
              strokeWidth={w * (1 - values[4] / values[0])}
            />
            <text x="15" y={y + 4}>
              {i ? "AFTER" : "BEFORE"}
            </text>
            <text className="cohort-count" x="115" y={y + 4}>
              {values[0].toLocaleString("en-US")}
            </text>
            <circle cx="365" cy={y} r="17" />
            <text
              className="cohort-purchase"
              x="365"
              y={y + 4}
              textAnchor="middle"
            >
              {values[4]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
const reactions: Record<
  ChallengeId,
  { left: string; right: string; detail: string }
> = {
  tracking: {
    left: "RECORDED SIGNAL",
    right: "ORDER LEDGER?",
    detail: "Reconcile before interpreting the rate.",
  },
  sample: {
    left: "OBSERVED SAMPLE",
    right: "UNCERTAINTY",
    detail: "Independent units and power still matter.",
  },
  attribution: {
    left: "ASSIGNED CREDIT",
    right: "INCREMENTAL VALUE?",
    detail: "A credit rule is not a counterfactual.",
  },
  missing: {
    left: "KNOWN LABELS",
    right: "UNKNOWN BUCKET",
    detail: "8 of 100 orders have no campaign label.",
  },
  causality: {
    left: "OBSERVATION",
    right: "CAUSAL PROOF?",
    detail: "The counterfactual has not been observed.",
  },
  cost: {
    left: "DELIVERY COST",
    right: "CONTRIBUTION",
    detail: "A commercial hurdle, not an uplift forecast.",
  },
};
export function ChallengeSignal({
  id,
  cost,
}: {
  id: ChallengeId;
  cost: number;
}) {
  const r = reactions[id];
  return (
    <div
      key={id}
      className={`challenge-signal reaction-${id}`}
      data-testid="challenge-signal"
      data-challenge={id}
    >
      <div className="reaction-labels">
        <span>{r.left}</span>
        <span>{r.right}</span>
      </div>
      <svg viewBox="0 0 480 66" aria-hidden="true">
        <path className="reaction-base" d="M0 33H480" />
        {id === "tracking" ? (
          <path
            className="reaction-trace"
            d="M0 33H140l14-18 14 36 14-18h26m32 0h60l14-18 14 36 14-18h138"
          />
        ) : id === "attribution" ? (
          <>
            <path className="reaction-trace" d="M0 12C200 12 270 55 480 55" />
            <path
              className="reaction-trace secondary"
              d="M0 55C200 55 270 12 480 12"
            />
          </>
        ) : id === "missing" ? (
          <>
            {Array.from({ length: 100 }, (_, i) => (
              <rect
                key={i}
                data-label-state={i >= 92 ? "unknown" : "known"}
                x={(i % 50) * 9.5}
                y={i < 50 ? 21 : 38}
                width="5"
                height="8"
                className={i >= 92 ? "unknown-signal" : "known-signal"}
              />
            ))}
          </>
        ) : id === "sample" ? (
          <>
            <path
              className="reaction-range"
              d="M175 33h135M175 17v32M310 17v32"
            />
            <circle cx="240" cy="33" r="5" fill="#d9ff43" />
          </>
        ) : id === "causality" ? (
          <>
            <path className="reaction-trace" d="M0 33H210" />
            <path className="reaction-unproven" d="M270 33H480" />
            <text x="240" y="40" textAnchor="middle">
              ≠
            </text>
          </>
        ) : (
          <>
            <path
              className="reaction-trace"
              d={`M0 50L${Math.min(420, 55 + cost / 25)} 15H480`}
            />
            <path className="reaction-unproven" d="M0 50H480" />
          </>
        )}
      </svg>
      <p>
        {id === "cost"
          ? `${breakEven(cost)} incremental orders needed at assumed $40 contribution each.`
          : r.detail}
      </p>
    </div>
  );
}
