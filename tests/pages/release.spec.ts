import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const prefix = "/THE-UNAPPLICATION/";

test("project URL hydrates, loads every requested local asset and permits immediate navigation", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => {
    if (response.url().startsWith(origin + "/") && !response.ok()) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(prefix);
  await expect(page.locator("h1")).toContainText("MY THINKING");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  await expect(page.locator("#scene-styles")).toHaveAttribute("media", "all");
  await page.getByRole("link", { name: "Put my thinking to the test" }).click();
  await expect(page).toHaveURL(/\/THE-UNAPPLICATION\/#brief$/);
  await page.getByRole("button", { name: /Customer behaviour/ }).click();
  await page.getByLabel("Visitor cohort").selectOption("new");
  await expect(page.getByText("0.67% → 0.36%")).toBeVisible();
  await page.getByRole("button", { name: /Marketing effectiveness/ }).click();
  await page.getByLabel("Attribution rule").selectOption("first");
  await expect(page.getByText("$100", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Does this establish causality/ }).click();
  await expect(page.locator("#decision h3")).toContainText("prioritise a hypothesis");
  expect(errors).toEqual([]);
});

test("public downloads and click-time brief resolve beneath the project path", async ({ page, request }) => {
  for (const file of ["scenario.json", "evidence-manifest.json", "favicon.svg", "scenes.css", "decision-brief.pdf"]) {
    const response = await request.get(prefix + file);
    expect(response.ok(), file).toBeTruthy();
    if (file.endsWith(".pdf")) expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  await page.goto(prefix + "#proof");
  await expect(page.locator("#proof-heading")).toBeInViewport();
  await page.getByRole("button", { name: /What if the fix costs too much/ }).click();
  await page.getByRole("slider", { name: /Illustrative delivery cost/ }).fill("2000");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your decision brief" }).click();
  const download = await pending;
  const html = readFileSync((await download.path())!, "utf8");
  expect(html).toContain("cost USD 2000");
  expect(html).toContain("SYNTHETIC SCENARIO");
  await page.goto(prefix + "#resume");
  await expect(page.getByText("RESUME / AWAITING APPROVED FILE")).toBeVisible();
  await expect(page.getByRole("link", { name: /Download approved resume/ })).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveAttribute("href", /yash\.h2700@gmail\.com/);
});

test("reduced-motion accessibility and the 404 return link work at a subpath", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(prefix);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.goto(prefix + "missing-page/");
  await expect(page.getByRole("link", { name: /Back to the experience/ })).toHaveAttribute("href", prefix);
  await page.getByRole("link", { name: /Back to the experience/ }).click();
  await expect(page.locator("h1")).toContainText("MY THINKING");
});
