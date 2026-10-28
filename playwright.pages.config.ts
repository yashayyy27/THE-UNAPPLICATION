import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/pages",
  workers: 1,
  reporter: "list",
  use: { baseURL: process.env.PAGES_ORIGIN || "http://127.0.0.1:4175", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: devices["Desktop Chrome"] },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: process.env.PAGES_ORIGIN ? undefined : {
    command: "python3 scripts/preview-pages.py",
    url: "http://127.0.0.1:4175/THE-UNAPPLICATION/",
    reuseExistingServer: false,
  },
});
