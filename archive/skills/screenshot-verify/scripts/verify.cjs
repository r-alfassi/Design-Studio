// ── SCREENSHOT VERIFY ────────────────────────────────────────────────────────
// Template script for visual verification of HTML presentation changes.
// Copy to the session scratchpad, adapt the config block, then run with:
//   node verify.cjs
// Requires: npm install playwright (already installed in the presentations dir)

const { chromium } = require('playwright');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const OUT      = 'REPLACE_WITH_SESSION_SCRATCHPAD_PATH';
// Leave CHROMIUM empty to use Playwright's managed browser (run `npx playwright
// install chromium` first). Only set it to override with a specific binary, e.g.
// via `CHROMIUM_PATH=/path/to/chrome node verify.cjs`.
const CHROMIUM = process.env.CHROMIUM_PATH || '';
const PORT     = 7654;
const FILE     = 'ST_Presentation.html';
const BEATS    = 0;   // number of nextBeat() calls to reach the target beat
// ─────────────────────────────────────────────────────────────────────────────

async function shoot(lang, filename) {
  const launchOpts = { headless: true };
  if (CHROMIUM) launchOpts.executablePath = CHROMIUM;
  const browser = await chromium.launch(launchOpts);
  const page    = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(`http://localhost:${PORT}/${FILE}`);
  await page.waitForTimeout(2500);

  // Switch to Hebrew/RTL mode
  // if (lang === 'he') {
  //   await page.evaluate(() => toggleLang());
  //   await page.waitForTimeout(600);
  // }

  // Navigate to the target beat
  for (let i = 0; i < BEATS; i++) {
    await page.evaluate(() => nextBeat());
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(800);

  // Unlock the chat input area (required to see attachment chips)
  // await page.evaluate(() => { if (typeof revealInput === 'function') revealInput(); });
  // await page.waitForTimeout(400);

  // Toggle a specific view mode (e.g. storyboard list vs. grid)
  // await page.evaluate(() => toggleShotListView && toggleShotListView());
  // await page.waitForTimeout(300);

  // Inspect computed styles for CSS verification
  // const styles = await page.evaluate(() => {
  //   const el = document.querySelector('.your-selector');
  //   if (!el) return { error: 'element not found' };
  //   const cs = getComputedStyle(el);
  //   return { textAlign: cs.textAlign, paddingLeft: cs.paddingLeft };
  // });
  // console.log(`[${lang}] Computed styles:`, JSON.stringify(styles, null, 2));

  await page.screenshot({ path: `${OUT}/${filename}` });
  console.log(`Screenshot saved: ${filename}`);
  await browser.close();
}

(async () => {
  await shoot('en', `verify_en_beat${BEATS}.png`);
  // await shoot('he', `verify_he_beat${BEATS}.png`);
})();
