// Smoke test: boots the game in a phone-sized headless browser and plays through the main flow.
//   npm test                 (first time: npx playwright install chromium)
// Fails on any page error, and saves screenshots to tests/screens/ so you can eyeball the result.
import {chromium} from 'playwright';
import fs from 'node:fs';
import {startServer} from '../tools/serve.mjs';

const PORT = 8099;
const OUT = new URL('./screens/', import.meta.url).pathname;
fs.mkdirSync(OUT, {recursive: true});
const server = await startServer(PORT);
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 844, height: 390}, deviceScaleFactor: 2, hasTouch: true, isMobile: true});
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
// Only the game's own files must load; outside services (fonts, leaderboard) may be offline.
page.on('requestfailed', r => { if (r.url().includes(`localhost:${PORT}`)) errors.push('Missing file: ' + r.url()); });
page.on('response', r => { if (r.status() >= 400 && r.url().includes(`localhost:${PORT}`)) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
const shot = name => page.screenshot({path: OUT + name + '.png'});
const step = (msg) => console.log('  ✓', msg);

try {
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForTimeout(900); await shot('01-splash'); step('splash');
  await page.waitForSelector('#title:not([hidden])', {timeout: 10000}); await shot('02-title'); step('title');
  await page.click('#titleTap');
  await page.waitForSelector('#name:not([hidden])');
  await page.fill('#pname', 'ab'); await page.click('#nameForm button[type=submit]');
  if (!(await page.locator('#pname.bad').count())) throw new Error('short name was accepted');
  step('name validation');
  await page.fill('#pname', 'SmokeTest'); await page.click('#nameForm button[type=submit]');
  await page.waitForSelector('#howto:not([hidden])'); await shot('03-howto'); step('how to play');
  await page.click('#howGo');
  await page.waitForSelector('#countdown:not([hidden])'); await shot('04-countdown'); step('countdown');
  await page.waitForSelector('#hud:not([hidden]):not(:has(~ #countdown:not([hidden])))', {timeout: 6000}).catch(() => {});
  await page.waitForTimeout(2500);
  await page.keyboard.press('ArrowUp');
  for (let i = 0; i < 10; i++) { await page.waitForTimeout(500); if (i % 3 === 1) await page.keyboard.press('Space'); }
  await shot('05-play'); step('riding');
  await page.keyboard.press('Escape');
  await page.waitForSelector('#pause:not([hidden])'); await shot('06-pause'); step('pause');
  await page.click('#pQuit');
  await page.waitForSelector('#menu:not([hidden])'); await shot('07-menu'); step('menu');
  for (const s of ['missions', 'garage', 'ranks']) {
    await page.click(`#menu [data-go=${s}]`); await page.waitForSelector(`#${s}:not([hidden])`); await shot('08-' + s);
    await page.click(`#${s} [data-go=menu]`); step(s);
  }
  const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('akhbaar-rush')));
  if (profile.name !== 'SMOKETEST') throw new Error('profile not saved');
  step('profile saved');
  if (errors.length) throw new Error('Page errors:\n' + errors.join('\n'));
  console.log('\nSmoke test passed. Screenshots in tests/screens/\n');
} catch (e) {
  console.error('\nSmoke test FAILED:', e.message, '\n');
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
