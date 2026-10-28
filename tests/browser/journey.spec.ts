import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import resumeConfig from "../../content/resume.json" with { type: "json" };
test("primary journey, all investigation paths and revised decision", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("MY THINKING");
  const primary = await page.getByRole("link", {name: "Put my thinking to the test"}).boundingBox();
  expect(primary!.y + primary!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.getByRole("link", { name: "Put my thinking to the test" }).click();
  await expect(page).toHaveURL(/#brief/);
  await page.getByRole("button", { name: /Customer behaviour/ }).click();
  await page.getByLabel("Visitor cohort").selectOption("new");
  await expect(page.getByText("0.67% → 0.36%")).toBeVisible();
  await page.getByRole("button", { name: /Marketing effectiveness/ }).click();
  await page.getByLabel("Attribution rule").selectOption("first");
  await expect(page.getByText("$100", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Measurement integrity/ }).click();
  await page.getByRole("slider", { name: /What if purchases/ }).fill("20");
  await expect(page.getByText("125.0", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: /Does this establish causality/ })
    .click();
  await expect(page.locator("#decision h3")).toContainText(
    "prioritise a hypothesis",
  );
  expect(errors).toEqual([]);
});
test("all six challenges produce distinct, useful responses", async ({
  page,
}) => {
  await page.goto("/");
  const buttons = page
    .getByRole("group", { name: "Challenge an assumption" })
    .getByRole("button");
  const texts = new Set<string>();
  for (let i = 0; i < 6; i++) {
    await buttons.nth(i).click();
    await expect(buttons.nth(i)).toHaveAttribute("aria-pressed", "true");
    texts.add(await page.locator(".challenge-response h3").innerText());
    await expect(page.locator(".revised-action")).not.toBeEmpty();
  }
  expect(texts.size).toBe(6);
  await page
    .getByRole("slider", { name: /Illustrative delivery cost/ })
    .fill("2000");
  await expect(page.locator(".cost-control")).toContainText("50");
});
test("current-selection brief downloads, and default PDF is a real file", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /Does this establish causality/ })
    .click();
  const pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download your decision brief" })
    .click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe(
    "THE-UNAPPLICATION-decision-brief.html",
  );
  const file = await download.path();
  const html = readFileSync(file!, "utf8");
  expect(html).toContain("causality");
  expect(html).toContain("SYNTHETIC SCENARIO");
  expect(html).toContain("counterfactual");
  await page.setContent(html);
  const printed = await page.pdf({ format: "A4", preferCSSPageSize: true });
  expect(
    (printed.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length,
  ).toBe(1);
  const pdf = await request.get("/decision-brief.pdf");
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
});
test("evidence, contact, fixture, manifest and all local anchors resolve", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const ids = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")!.slice(1)));
  for (const id of ids)
    expect(await page.locator(`[id="${id}"]`).count()).toBe(1);
  for (const url of [
    "/scenario.json",
    "/evidence-manifest.json",
    "/favicon.svg",
  ])
    expect((await request.get(url)).ok()).toBeTruthy();
  await page.getByText("What is verified—and what isn’t?").click();
  await expect(page.getByText(/The linked resume is owner-approved/)).toBeVisible();
  expect(
    await page.locator('a[href^="mailto:"]').getAttribute("href"),
  ).toContain("yash.h2700@gmail.com");
  for (const a of await page.locator('a[target="_blank"]').all())
    expect(await a.getAttribute("rel")).toContain("noopener");
});
test("the approved final resume downloads with its exact recorded identity", async ({ page }) => {
  await page.goto("/#resume");
  const link = page.getByRole("link", { name: /Download approved resume/ });
  await expect(link).toHaveAttribute("href", resumeConfig.approved.href);
  await expect(link).toHaveAttribute("download");
  const pending = page.waitForEvent("download");
  await link.click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("yash-hurdale.pdf");
  const pdf = readFileSync((await download.path())!);
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  expect(pdf.length).toBe(resumeConfig.approved.bytes);
  expect(createHash("sha256").update(pdf).digest("hex")).toBe(resumeConfig.approved.sha256);
});
test("keyboard entry, reduced motion, accessibility and no horizontal overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to the experience" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("button", { name: /Marketing effectiveness/ }).click();
  const branch = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(branch.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("capture actual experience", async ({ page }, info) => {
  await page.goto("/");
  await page.screenshot({
    path: `docs/screenshots/${info.project.name}.png`,
    fullPage: true,
  });
  await page.screenshot({
    path: `docs/screenshots/${info.project.name}-hero.png`,
    fullPage: false,
  });
});
