import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
const [phase, url] = process.argv.slice(2);
if (!['before', 'after'].includes(phase) || !url) throw new Error('Usage: node scripts/capture-recruiter-audit.mjs before|after URL');
const directory = 'docs/recruiter-audit/screenshots';
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, options] of [['desktop', { viewport: { width: 1280, height: 900 } }], ['mobile', { ...devices['iPhone 13'], defaultBrowserType: undefined }]]) {
    const context = await browser.newContext({ ...options, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('#scene-styles')?.media === 'all');
    await page.screenshot({ path: `${directory}/${phase}-${name}-hero.png` });
    for (const id of ['decision', 'contact']) {
      await page.locator(`#${id}`).evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
      await page.screenshot({ path: `${directory}/${phase}-${name}-${id}.png` });
    }
    await page.locator('#resume').screenshot({ path: `${directory}/${phase}-${name}-resume.png` });
    console.log(`${phase} ${name}: ${await page.title()}`);
    await context.close();
  }
} finally { await browser.close(); }
