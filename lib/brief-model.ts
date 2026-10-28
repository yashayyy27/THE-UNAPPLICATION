import { paths, challenges, type PathId, type ChallengeId } from "../content/edition";
import { scenario } from "../content/scenario";
import { adjustedPurchases, breakEven, pct, rate, credit, type Attribution } from "./analytics";
// Original pure model, shared by the immediate decision and deferred exporter.
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
