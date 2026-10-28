import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const root = ".experience";
async function playIfRequested(page: import("@playwright/test").Page) {
  const play = page.getByRole("button", { name: "Play introduction", exact: true });
  await expect(page.locator(".motion-control")).not.toBeDisabled();
  if (await play.isVisible()) await play.click();
}
test("optional intro pauses, resumes and skips while navigation remains available", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await playIfRequested(page);
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
  await expect(page.getByRole("link", { name: /Download resume/ })).toHaveAttribute("href", "./resume/yash-hurdale.pdf");
  await expect(page.getByText("RESUME / DATA ANALYST")).toBeVisible();
});
test("navigation and inquiry work before the visual sequence finishes", async ({
  page,
}) => {
  await page.goto("/");
  await playIfRequested(page);
  await expect(page.locator(root)).toHaveAttribute("data-phase", "noise");
  await page.getByRole("link", { name: "The challenge", exact: true }).click();
  await expect(page).toHaveURL(/#red-team/);
  await expect(page.locator("#red-team-heading")).toBeInViewport();
  await page.getByRole("link", { name: "Evidence", exact: true }).click();
  await expect(page).toHaveURL(/#proof/);
  await expect(page.locator("#proof-heading")).toBeInViewport();
  await expect(page.locator("#proof")).toHaveCSS("content-visibility", "visible");
  await expect.poll(async () => Math.abs((await page.locator("#proof").boundingBox())!.y - (await page.locator(".site-header").boundingBox())!.height)).toBeLessThanOrEqual(12);
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
    Object.defineProperty(window, "PerformanceObserver", { value: undefined, configurable: true });
  });
  await page.route(/\.(svg|png|jpe?g|webp|mp4|webm|woff2?)(\?|$)/, (r) =>
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
  await expect(page.getByRole("link", { name: /Download resume/ })).toHaveAttribute("href", "./resume/yash-hurdale.pdf");
  await expect(
    page.getByRole("link", { name: "Or download the default PDF brief" }),
  ).toHaveAttribute("href", "./decision-brief.pdf");
  await expect(page.getByRole("group", { name: "Inspect technical evidence" }).getByRole("link")).toHaveCount(4);
  await expect(page.locator("body")).not.toContainText("REVIEW DRAFT");
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
    await expect(page.locator("#investigation .viewport-visual")).toHaveAttribute(
      "data-visual-ready",
      "true",
    );
    const graphic = path.startsWith("Measurement") ? ".measurement-visual" : path.startsWith("Marketing") ? ".attribution-visual" : ".cohort-visual";
    await expect(page.locator(graphic)).toBeVisible();
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
  await page.locator(".challenge-response").scrollIntoViewIfNeeded();
  await expect(page.locator('.challenge-signal[data-challenge="causality"]')).toBeVisible();
  await page.screenshot({ path: `docs/screenshots/v2/${info.project.name}-red-team-response.png` });
  await page
    .getByRole("link", {
      name: "Take this challenge into the decision",
      exact: true,
    })
    .click();
  await expect.poll(async () => Math.abs((await page.locator("#decision").boundingBox())!.y - (await page.locator(".site-header").boundingBox())!.height)).toBeLessThanOrEqual(12);
  await page.screenshot({
    path: `docs/screenshots/v2/${info.project.name}-decision.png`,
  });
  await page.getByRole("link", { name: "Back to the question", exact: false }).click();
  await page.screenshot({ path: `docs/screenshots/v2/${info.project.name}-full.png`, fullPage: true });
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
  await playIfRequested(page);
  await expect(page.locator(root)).toHaveAttribute("data-phase", "noise");
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

test("concurrent scene styling works without hydration and keeps the first frame stable", async ({ page }) => {
  await page.route("**/scenes.css", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const before = await page.locator("#hero-title").boundingBox();
  const problem = await page.locator("#brief-heading").boundingBox();
  await expect.poll(() => page.locator("#scene-styles").getAttribute("media")).toBe("all");
  const after = await page.locator("#hero-title").boundingBox();
  const problemAfter = await page.locator("#brief-heading").boundingBox();
  expect(after).toEqual(before);
  expect(problemAfter).toEqual(problem);
  await page.getByRole("link", { name: "Evidence", exact: true }).click();
  await expect(page.locator("#proof-heading")).toBeInViewport();
  await expect(page.locator("#proof")).toHaveCSS("content-visibility", "visible");
  expect(await page.locator(".evidence-grid").evaluate(e => getComputedStyle(e).display)).toBe("grid");
});

test("scene stylesheet failure retains readable content, navigation and working analysis", async ({ page }) => {
  await page.route("**/scenes.css", route => route.abort());
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("link", { name: "Investigation", exact: true }).click();
  await page.getByRole("button", { name: /Customer behaviour/ }).click();
  await page.getByLabel("Visitor cohort").selectOption("returning");
  await expect(page.getByText("4.00% → 4.00%")).toBeVisible();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator('#contact a[href^="mailto:"]')).toBeVisible();
});

test("diagram code loads on approach and a failed chunk preserves the analytical journey", async ({ page }) => {
  const initial = new Set<string>();
  const collect = (request: import("@playwright/test").Request) => { if (request.url().includes("/_next/static/chunks/")) initial.add(request.url()); };
  page.on("request", collect);
  await page.goto("/");
  await expect(page.locator(".motion-control")).not.toBeDisabled();
  await expect(page.locator(".viewport-measurement")).toHaveAttribute("data-visual-ready", "false");
  page.off("request", collect);
  const deferred: string[] = [];
  await page.route("**/_next/static/chunks/**", route => {
    if (!initial.has(route.request().url())) { deferred.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  await page.locator(".viewport-measurement").scrollIntoViewIfNeeded();
  await expect.poll(() => deferred.length).toBeGreaterThan(0);
  await expect(page.locator(".viewport-measurement .visual-poster")).toBeVisible();
  await expect(page.getByText("Diagram unavailable. Values and controls still work.", { exact: true })).toBeVisible();
  await expect(page.locator(".reconciliation")).toContainText("100");
  await page.getByRole("button", { name: /Marketing effectiveness/ }).click();
  await page.getByLabel("Attribution rule").selectOption("linear");
  await expect(page.getByText("$75", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Evidence", exact: true }).click();
  await expect(page.locator("#proof-heading")).toBeInViewport();
  await expect(page.locator("#proof")).toHaveCSS("content-visibility", "visible");
});

test("default first frame exposes motion choice and preserves the complete introduction", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator(".motion-control")).not.toBeDisabled();
  const touch = await page.evaluate(() => matchMedia("(hover: none) and (pointer: coarse)").matches);
  if (touch) {
    await expect(page.locator(root)).toHaveAttribute("data-motion", "static");
    await expect(page.locator(root)).toHaveAttribute("data-phase", "complete");
    await expect(page.getByRole("button", { name: "Play introduction", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Play cinematic introduction/ })).toBeVisible();
  } else await expect(page.locator(root)).toHaveAttribute("data-phase", "noise");
  await page.screenshot({ path: `docs/recruiter-readiness/screenshots/${info.project.name}-default-hero.png` });
  if (touch) {
    await page.getByRole("button", { name: "Play introduction", exact: true }).click();
    await expect(page.locator(root)).toHaveAttribute("data-phase", "noise");
    await expect(page.locator(root)).toHaveAttribute("data-phase", "sorting", { timeout: 6000 });
    await page.screenshot({ path: "docs/recruiter-readiness/screenshots/mobile-intro-playing.png" });
    await page.getByRole("button", { name: "Skip introduction", exact: true }).click();
    await expect(page.locator(root)).toHaveAttribute("data-phase", "complete");
  }
});

test("a failed brief module offers retry and retains the real default PDF", async ({ page, request }) => {
  await page.goto("/");
  await page.route("**/_next/static/chunks/**", route => route.abort());
  await page.getByRole("link", { name: "Take this challenge into the decision", exact: true }).click();
  await expect(page.locator("#decision-heading")).toBeInViewport();
  await page.getByRole("button", { name: "Download your decision brief", exact: true }).click();
  await expect(page.getByText("Couldn’t prepare the brief. Retry, or use the default PDF below.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download your decision brief", exact: true })).toBeEnabled();
  const pdf = await request.get("/decision-brief.pdf");
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.unroute("**/_next/static/chunks/**");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your decision brief", exact: true }).click();
  expect((await pending).suggestedFilename()).toBe("THE-UNAPPLICATION-decision-brief.html");
});

test("a delayed brief keeps the click-time selection while analysis remains interactive", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /What if the fix costs too much/ }).click();
  const cost = page.getByRole("slider", { name: /Illustrative delivery cost/ });
  await cost.fill("2000");
  await page.route("**/_next/static/chunks/**", async route => {
    await new Promise(resolve => setTimeout(resolve, 700));
    await route.continue();
  });
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your decision brief", exact: true }).click();
  await expect(page.getByText("Preparing the brief for your selected analysis…", { exact: true })).toBeVisible();
  await cost.fill("4000");
  const html = readFileSync((await (await pending).path())!, "utf8");
  expect(html).toContain("50 incremental orders");
  expect(html).toContain("cost USD 2000");
  await expect(page.locator(".cost-control")).toContainText("100");
  const second = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your decision brief", exact: true }).click();
  const next = readFileSync((await (await second).path())!, "utf8");
  expect(next).toContain("100 incremental orders");
  expect(next).toContain("cost USD 4000");
});
