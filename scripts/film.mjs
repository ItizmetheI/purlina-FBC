// Record the dive as a filmstrip: constant-velocity scroll + frame captures.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';

const OUT = process.argv[2] || 'film';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--window-size=1500,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });
await page.waitForFunction(() => !document.querySelector('main div.z-50'), { timeout: 60000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 3500));

await page.evaluate(() => {
  window.__scrollDone = false;
  const total = document.documentElement.scrollHeight - innerHeight;
  const speed = 1250; // px/s — a brisk but realistic reading pace
  let last = performance.now();
  const step = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    window.scrollTo(0, window.scrollY + speed * dt);
    if (window.scrollY < total - 2) requestAnimationFrame(step);
    else window.__scrollDone = true;
  };
  requestAnimationFrame(step);
});

let i = 0;
for (;;) {
  const done = await page.evaluate(() => window.__scrollDone);
  await page.screenshot({ path: `${OUT}/f${String(i).padStart(3, '0')}.jpg`, quality: 45, type: 'jpeg' });
  i++;
  if (done) break;
  await new Promise((r) => setTimeout(r, 320));
}
console.log('frames:', i);
await browser.close();
