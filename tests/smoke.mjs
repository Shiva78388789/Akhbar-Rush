// Smoke test: boots the game in a phone-sized headless browser and plays through the main flow.
//   npm test                 (first time: npx playwright install chromium)
// Fails on any page error, and saves screenshots to tests/screens/ so you can eyeball the result.
// Part 2 replays the ride with touch taps as an iPhone and as an Android phone: every fix must work on both.
import {chromium} from 'playwright';
import fs from 'node:fs';
import {startServer} from '../tools/serve.mjs';

const PORT = 8099;
const OUT = new URL('./screens/', import.meta.url).pathname;
fs.mkdirSync(OUT, {recursive: true});
const server = await startServer(PORT);
// CHROMIUM_PATH lets you point at an already-installed Chromium instead of `npx playwright install`.
const browser = await chromium.launch({args: ['--autoplay-policy=user-gesture-required'], ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {})});
const page = await browser.newPage({viewport: {width: 844, height: 390}, deviceScaleFactor: 2, hasTouch: true, isMobile: true});
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
// Only the game's own files must load; outside services (fonts, leaderboard) may be offline.
page.on('requestfailed', r => { if (r.url().includes(`localhost:${PORT}`)) errors.push('Missing file: ' + r.url()); });
page.on('response', r => { if (r.status() >= 400 && r.url().includes(`localhost:${PORT}`)) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
const shot = name => page.screenshot({path: OUT + name + '.png'});
const step = (msg) => console.log('  ✓', msg);

// Phones in landscape. The height is smaller than the screen because the browser bar takes some of it.
const PHONES = [
  {name: 'iphone', viewport: {width: 844, height: 340}, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0 Mobile/15E148 Safari/604.1'},
  {name: 'android', viewport: {width: 800, height: 330}, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36'},
];

// Plays with touch taps only (no keyboard, no mouse) and checks sound, pause menu, settings and quit.
async function touchRun(phone) {
  const ctx = await browser.newContext({viewport: phone.viewport, userAgent: phone.userAgent, hasTouch: true, isMobile: true, deviceScaleFactor: 2});
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.addInitScript(() => { const A = window.AudioContext; window.__ac = []; window.AudioContext = class extends A { constructor(...a) { super(...a); window.__ac.push(this); } }; });
  const vis = () => p.evaluate(() => [...document.querySelectorAll('.screen')].filter(s => !s.hidden).map(s => s.id).join(','));
  const expect = async (id, what) => { await p.waitForSelector(`#${id}:not([hidden])`, {timeout: 6000}).catch(async () => { throw new Error(`${phone.name}: ${what} – visible screens: ${await vis()}`); }); };
  await p.goto(`http://localhost:${PORT}/`);
  await expect('title', 'title screen');
  await p.tap('#titleTap');
  await p.waitForTimeout(300);
  const sound = await p.evaluate(() => window.__ac.map(a => a.state).join());
  if (sound !== 'running') throw new Error(`${phone.name}: sound not running after first tap (${sound})`);
  step(`${phone.name}: sound on after first tap`);
  await expect('name', 'name screen');
  await p.fill('#pname', 'Tapper'); await p.tap('#nameForm button[type=submit]');
  await expect('howto', 'how to play'); await p.tap('#howGo');
  await expect('countdown', 'countdown'); await p.waitForTimeout(3600);
  await p.tap('#hPause'); await expect('pause', 'pause menu after tapping pause');
  await p.screenshot({path: `${OUT}${phone.name}-pause.png`});
  await p.tap('#pResume'); await p.waitForTimeout(300);
  if (await p.locator('#pause:not([hidden])').count()) throw new Error(`${phone.name}: resume did not close the pause menu`);
  await p.tap('#hPause'); await expect('pause', 'pause menu (2nd time)');
  await p.tap('#pSettings'); await expect('settings', 'settings from pause');
  await p.tap('#sDone'); await expect('pause', 'back to pause from settings');
  await p.tap('#pQuit'); await expect('menu', 'menu after quit');
  step(`${phone.name}: pause, resume, settings and quit by touch`);
  const box = await p.evaluate(() => { const r = document.querySelector('#stage').getBoundingClientRect(); return {top: r.top, bottom: r.bottom, h: innerHeight}; });
  if (box.top < -1 || box.bottom > box.h + 1) throw new Error(`${phone.name}: game does not fit the screen ${JSON.stringify(box)}`);
  step(`${phone.name}: game fits the visible screen`);
  if (errs.length) throw new Error(`${phone.name} page errors:\n` + errs.join('\n'));
  await ctx.close();
}

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
  for (const phone of PHONES) await touchRun(phone);
  console.log('\nSmoke test passed. Screenshots in tests/screens/\n');
} catch (e) {
  console.error('\nSmoke test FAILED:', e.message, '\n');
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
