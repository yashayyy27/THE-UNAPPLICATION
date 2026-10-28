import { describe, expect, it } from "vitest";
import {
  rate,
  change,
  wilson,
  credit,
  adjustedPurchases,
  breakEven,
} from "../lib/analytics";
import { briefHtml } from "../lib/brief";
import { scenario } from "../content/scenario";
import {
  artifact,
  sourceCommit,
  challenges,
  paths,
  evidence,
} from "../content/edition";
describe("deterministic analytical boundaries", () => {
  it("calculates the actual contradiction from input counts", () => {
    expect(change(2000, 3300)).toBeCloseTo(0.65);
    expect(rate(100, 5000)).toBe(0.02);
    expect(rate(100, 7500)).toBeCloseTo(0.0133333);
    expect(change(8000, 8000)).toBe(0);
  });
  it("does not turn unavailable denominators into zeros", () => {
    expect(rate(0, 0)).toBeNull();
    expect(wilson(0, 0)).toBeNull();
    expect(change(0, 1)).toBeNull();
  });
  it.each([
    [-1, 3],
    [4, 3],
    [NaN, 3],
    [1, Infinity],
  ])("rejects impossible counts %s/%s", (a, b) =>
    expect(() => rate(a, b)).toThrow(RangeError),
  );
  it("matches a known Wilson example (50/100)", () => {
    const v = wilson(50, 100)!;
    expect(v[0]).toBeCloseTo(0.4038, 4);
    expect(v[1]).toBeCloseTo(0.5962, 4);
  });
  it("supports zero and all successes", () => {
    expect(wilson(0, 100)![0]).toBe(0);
    expect(wilson(100, 100)![1]).toBeCloseTo(1, 14);
  });
  it.each(["first", "last", "linear"] as const)(
    "preserves all revenue for %s credit",
    (model) =>
      expect(Object.values(credit(model)).reduce((a, b) => a + b, 0)).toBe(150),
  );
  it("gives genuinely different attribution interpretations", () => {
    expect(credit("first")).toEqual({
      Email: 100,
      "Paid search": 50,
      Organic: 0,
    });
    expect(credit("last").Organic).toBe(150);
    expect(credit("linear")).toEqual({
      Email: 50,
      "Paid search": 25,
      Organic: 75,
    });
  });
  it("sensitivity changes estimates without inventing observed purchases", () => {
    expect(adjustedPurchases(100, 0)).toBe(100);
    expect(adjustedPurchases(100, 20)).toBe(125);
    expect(scenario.after.purchases).toBe(100);
    expect(() => adjustedPurchases(100, 100)).toThrow();
    expect(() => adjustedPurchases(100, -1)).toThrow();
  });
  it("uses contribution and rounds break-even orders up", () => {
    expect(breakEven(1001)).toBe(26);
    expect(breakEven(1000)).toBe(25);
    expect(breakEven(0)).toBe(0);
    expect(() => breakEven(100, 0)).toThrow();
    expect(() => breakEven(-1)).toThrow();
  });
  it("cohorts add up at every ordered stage in both periods", () => {
    for (const period of ["before", "after"] as const)
      for (let i = 0; i < 5; i++) {
        expect(
          scenario.cohorts[1][period][i] + scenario.cohorts[2][period][i],
        ).toBe(scenario.cohorts[0][period][i]);
        for (const c of scenario.cohorts)
          if (i > 0) expect(c[period][i]).toBeLessThanOrEqual(c[period][i - 1]);
      }
  });
  it("exports all 18 path/challenge combinations with current assumptions and provenance", () => {
    for (const path of paths)
      for (const challenge of challenges) {
        const html = briefHtml({
          path: path.id,
          challenge: challenge.id,
          missing: 20,
          cost: 2000,
        });
        expect(html).toContain(challenge.action);
        expect(html).toContain(path.title);
        expect(html).toContain("125.0");
        expect(html).toContain("50 incremental orders");
        expect(html).toContain("SYNTHETIC SCENARIO");
        expect(html).toContain("NOT CLIENT DATA");
        expect(html).toContain("No uplift, client outcome or causal impact has been established.");
        expect(html).toContain(challenge.needed.replace("&", "&amp;"));
        expect(html).not.toMatch(/REVIEW DRAFT|Applicant review is still required/);
        expect(html).toContain(sourceCommit);
      }
  });
  it("preserves attribution and cohort selections in the brief", () => {
    expect(
      briefHtml({
        path: "effectiveness",
        challenge: "attribution",
        missing: 0,
        cost: 1000,
        model: "linear",
      }),
    ).toContain("Organic USD 75");
    expect(
      briefHtml({
        path: "behaviour",
        challenge: "causality",
        missing: 0,
        cost: 1000,
        cohort: "returning",
      }),
    ).toContain("4.00% to 4.00%");
  });
  it("pins every upstream artifact to the audited revision", () => {
    for (const e of evidence) {
      expect(artifact(e.path)).toContain(`/blob/${sourceCommit}/`);
      expect(artifact(e.secondary)).toMatch(
        /^https:\/\/github.com\/yashayyy27\/exclamation-ai\//,
      );
    }
  });
});
