import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import resumeConfig from "../../content/resume.json" with { type: "json" };
import { openingEvidence, artifact, officialRole } from "../../content/edition";

test("opening evidence is directly inspectable with static motion and keyboard navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const group = page.getByRole("group", { name: "Inspect technical evidence" });
  for (const item of openingEvidence) {
    const link = group.getByRole("link", { name: item.label });
    await expect(link).toHaveAttribute("href", artifact(item.path));
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    const size = await link.boundingBox();
    expect(size!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.locator(".experience")).toHaveAttribute("data-motion", "static");
  await expect(page.locator("body")).not.toContainText("REVIEW DRAFT");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("role context stays bounded and final invitation downloads the unchanged approved resume", async ({ page }) => {
  await page.goto("/#proof");
  await page.getByText("What is verified—and what isn’t?").click();
  const details = page.locator(".evidence-details");
  await expect(details).toContainText("not an employer assessment of my fit");
  await expect(details).toContainText("header says Japan");
  await expect(details).toContainText("GA4/GTM is one group and BigQuery is another");
  await expect(details.getByRole("link", { name: "Read the official Data Analyst listing" })).toHaveAttribute("href", officialRole.url);
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  const contact = page.locator("#contact");
  const invitation = contact.getByRole("link", { name: "Interview Yash" });
  await expect(invitation).toBeInViewport();
  await expect(invitation).toHaveAttribute("href", /mailto:yash\.h2700@gmail\.com\?subject=Interview%20Yash/);
  const pending = page.waitForEvent("download");
  await contact.getByRole("link", { name: /Resume \(PDF/ }).click();
  const file = await (await pending).path();
  const bytes = readFileSync(file!);
  expect(bytes.length).toBe(resumeConfig.approved.bytes);
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(resumeConfig.approved.sha256);
});
