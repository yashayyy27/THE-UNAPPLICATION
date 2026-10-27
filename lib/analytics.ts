import { scenario } from "../content/scenario";
export function rate(successes: number, total: number): number | null {
  if (
    ![successes, total].every(Number.isFinite) ||
    successes < 0 ||
    total < 0 ||
    successes > total
  )
    throw new RangeError("Invalid counts");
  return total === 0 ? null : successes / total;
}
export function change(before: number, after: number): number | null {
  if (![before, after].every(Number.isFinite) || before < 0 || after < 0)
    throw new RangeError("Invalid values");
  return before === 0 ? null : (after - before) / before;
}
export function wilson(
  successes: number,
  total: number,
): [number, number] | null {
  const p = rate(successes, total);
  if (p === null) return null;
  const z = 1.96,
    d = 1 + (z * z) / total;
  const centre = (p + (z * z) / (2 * total)) / d;
  const half =
    (z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total))) / d;
  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}
export function adjustedPurchases(
  observed: number,
  missingPercent: number,
): number {
  if (
    !Number.isFinite(observed) ||
    observed < 0 ||
    !Number.isFinite(missingPercent) ||
    missingPercent < 0 ||
    missingPercent > 30
  )
    throw new RangeError("Missingness must be 0–30%");
  return observed / (1 - missingPercent / 100);
}
export type Attribution = "first" | "last" | "linear";
export function credit(model: Attribution): Record<string, number> {
  if (!["first", "last", "linear"].includes(model))
    throw new RangeError("Unknown model");
  const totals: Record<string, number> = {
    Email: 0,
    "Paid search": 0,
    Organic: 0,
  };
  for (const journey of scenario.journeys) {
    const selected =
      model === "first"
        ? journey.touches.slice(0, 1)
        : model === "last"
          ? journey.touches.slice(-1)
          : journey.touches;
    for (const touch of selected)
      totals[touch] += journey.revenue / selected.length;
  }
  return totals;
}
export function breakEven(cost: number, contribution = 40): number {
  if (
    !Number.isFinite(cost) ||
    !Number.isFinite(contribution) ||
    cost < 0 ||
    contribution <= 0
  )
    throw new RangeError("Invalid commercial assumptions");
  return Math.ceil(cost / contribution);
}
export const pct = (value: number | null, digits = 1) =>
  value === null ? "Unavailable" : `${(value * 100).toFixed(digits)}%`;
