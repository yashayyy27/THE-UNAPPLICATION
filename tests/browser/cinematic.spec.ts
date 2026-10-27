import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const root = ".experience";
test("optional intro pauses, resumes and skips while navigation remains available", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator(root)).toHaveAttribute("data-phase", "noise");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await page.clock.runFor(4000);
  await expect(page.locator(root)).toHaveAttribute("data-phase", "noise");
  await page
    .getByRole("button", { name: "Resume motion", exact: true })
    .click();
  await page.clock.runFor(3500);
  await expect(page.locator(root)).toHaveAttribute("data-phase", "sorting");
  await page
    .getByRole("button", { name: "Skip introduction", exact: true })
    .click();
  await expect(page.locator(root)).toHaveAttribute("data-phase", "complete");
  await page.getByRole("link", { name: "Investigation", exact: true }).click();
  await expect(page).toHaveURL(/#investigation/);
  await page.getByRole("link", { name: "Resume", exact: true }).click();
  await expect(page).toHaveURL(/#resume/);
  await expect(page.getByText("RESUME / AWAITING APPROVED FILE")).toBeVisible();
});
test("navigation and inquiry work before the visual sequence finishes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Evidence", exact: true }).click();
  await expect(page).toHaveURL(/#proof/);
  await expect(page.locator("#proof-heading")).toBeVisible();
  await expect
    .poll(async () => {
      const h = await page.locator(".site-header").boundingBox(),
        p = await page.locator("#proof-heading").boundingBox();
      return p!.y - h!.height;
    })
    .toBeGreaterThanOrEqual(0);
  await page.getByRole("link", { name: "Investigation", exact: true }).click();
  await page.getByRole("button", { name: /Marketing effectiveness/ }).click();
  await page.getByLabel("Attribution rule").selectOption("linear");
  await page.locator(".viewport-attribution").scrollIntoViewIfNeeded();
  await expect(page.locator(".attribution-visual [data-credit]")).toHaveCount(
    3,
  );
  const credits = await page
    .locator(".attribution-visual [data-credit]")
    .evaluateAll((els) =>
      els.map((e) => Number(e.getAttribute("data-credit"))),
    );
  expect(credits).toEqual([50, 25, 75]);
  expect(credits.reduce((a, b) => a + b, 0)).toBe(150);
});
test("reduced motion and later preference changes keep a complete static experience", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(root)).toHaveAttribute("data-motion", "static");
  expect(
    await page
      .locator(".aperture-canvas")
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
  await expect(page.locator("h1")).toContainText("MY THINKING");
  await page.getByRole("button", { name: /Customer behaviour/ }).click();
  await page.getByLabel("Visitor cohort").selectOption("returning");
  await page.locator(".viewport-cohort").scrollIntoViewIfNeeded();
  expect(
    await page
      .locator('.cohort-visual [data-period="after"]')
      .getAttribute("data-sessions"),
  ).toBe("2000");
  expect(
    await page
      .locator('.cohort-visual [data-period="after"]')
      .getAttribute("data-purchases"),
  ).toBe("80");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(root)).toHaveAttribute("data-phase", "complete");
});
test("Save-Data disables motion and needs no external media", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: Object.assign(new EventTarget(), { saveData: true }),
      configurable: true,
    }),
  );
  const media: string[] = [];
  page.on("request", (r) => {
    if (["media", "image", "font"].includes(r.resourceType()))
      media.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator(root)).toHaveAttribute("data-motion", "static");
  await expect(page.getByText("Data-saving mode respected")).toBeVisible();
  expect(media.filter((u) => !u.includes("/favicon."))).toEqual([]);
  await page.getByRole("link", { name: "Put my thinking to the test" }).click();
  await expect(page).toHaveURL(/#brief/);
});
test("unsupported observers and blocked media fail open", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      value: undefined,
      configurable: true,
    });
  });
  await page.route(/\.(png|jpe?g|webp|mp4|webm|woff2?)(\?|$)/, (r) =>
    r.abort(),
  );
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: /Measurement integrity/ }).click();
  expect(
    await page.locator('[data-event-kind="unique"]').getAttribute("data-count"),
  ).toBe("100");
  expect(
    await page
      .locator('[data-event-kind="duplicate"]')
      .getAttribute("data-count"),
  ).toBe("20");
  await page
    .getByRole("button", { name: /What if values are missing/ })
    .click();
  expect(await page.locator('[data-label-state="unknown"]').count()).toBe(8);
  await expect(page.locator("#decision h3")).toContainText(
    "explicit unknown bucket",
  );
});
test("no JavaScript still exposes the thesis, evidence, resume status and default PDF", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toContainText("MY THINKING");
  await expect(
    page.getByRole("link", { name: "Put my thinking to the test" }),
  ).toBeVisible();
  await expect(page.locator(root)).toHaveAttribute("data-motion", "static");
  await page.getByRole("link", { name: "Resume", exact: true }).click();
  await expect(page).toHaveURL(/#resume/);
  await expect(
    page.getByRole("link", { name: "Or download the default PDF brief" }),
  ).toHaveAttribute("href", "./decision-brief.pdf");
  await context.close();
});
test("state-aware download preserves visualisation choices after challenges", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Customer behaviour/ }).click();
  await page.getByLabel("Visitor cohort").selectOption("returning");
  await page
    .getByRole("button", { name: /What if the fix costs too much/ })
    .click();
  await page
    .getByRole("slider", { name: /Illustrative delivery cost/ })
    .fill("2000");
  const pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download your decision brief" })
    .click();
  const file = await (await pending).path();
  const html = readFileSync(file!, "utf8");
  expect(html).toContain("Returning visitors");
  expect(html).toContain("4.00% to 4.00%");
  expect(html).toContain("50 incremental orders");
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true });
  expect(
    (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length,
  ).toBe(1);
});
test("WCAG 2.2 checks and cinematic scene screenshots", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const issues = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(issues.violations).toEqual([]);
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await page.screenshot({
    path: `docs/screenshots/v2/${info.project.name}-hero.png`,
  });
  await page.screenshot({
    path: `docs/screenshots/v2/${info.project.name}-full.png`,
    fullPage: true,
  });
  for (const path of [
    "Measurement integrity",
    "Marketing effectiveness",
    "Customer behaviour",
  ]) {
    await page.getByRole("button", { name: new RegExp(path) }).click();
    await page
      .getByRole("link", { name: "Investigation", exact: true })
      .click();
    await page.locator(".panel-data").scrollIntoViewIfNeeded();
    await expect(page.locator(".viewport-visual")).toHaveAttribute(
      "data-visual-ready",
      "true",
    );
    await page.screenshot({
      path: `docs/screenshots/v2/${info.project.name}-${path.split(" ")[0].toLowerCase()}.png`,
    });
  }
  await page
    .getByRole("button", { name: /Does this establish causality/ })
    .click();
  await page
    .getByRole("link", { name: "Challenge this interpretation", exact: true })
    .click();
  await page.screenshot({
    path: `docs/screenshots/v2/${info.project.name}-red-team.png`,
  });
  await page
    .getByRole("link", {
      name: "Take this challenge into the decision",
      exact: true,
    })
    .click();
  await page.screenshot({
    path: `docs/screenshots/v2/${info.project.name}-decision.png`,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
test("intro suspends offscreen and responds to a visibility change", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("link", { name: "Evidence", exact: true }).click();
  await expect(page.locator(root)).toHaveAttribute(
    "data-intro-playing",
    "false",
  );
  const phase = await page.locator(root).getAttribute("data-phase");
  await page.clock.runFor(4000);
  await expect(page.locator(root)).toHaveAttribute("data-phase", phase!);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(root)).toHaveAttribute("data-motion", "paused");
});

test("supporting diagrams activate near the viewport without shifting the readout", async ({
  page,
}) => {
  await page.goto("/");
  const diagram = page.locator(".viewport-measurement");
  await expect(diagram).toHaveAttribute("data-visual-ready", "false");
  await expect(page.locator(".reconciliation")).toContainText("100");
  const height = (await diagram.boundingBox())!.height;
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute("data-visual-ready", "true");
  expect((await diagram.boundingBox())!.height).toBe(height);
  await expect(page.locator('[data-event-kind="unique"]')).toHaveAttribute(
    "data-count",
    "100",
  );
});
