// Headless walk of the dive: screenshot every act for visual verification.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';

const OUT = process.argv[2] || 'shots';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--window-size=1500,900', '--use-angle=d3d11', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 900 });
page.on('console', (m) => { if (m.type() === 'error') console.log('[page error]', m.text().slice(0, 200)); });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });

// wait for the loader to clear (canvas ready + exit animation)
await page.waitForFunction(() => !document.querySelector('main div.z-50'), { timeout: 60000 }).catch(() => console.log('loader still visible after 60s'));
await new Promise((r) => setTimeout(r, 3000));

const marks = await page.evaluate(() => {
  const m = {};
  document.querySelectorAll('[data-act]').forEach((el) => {
    m[el.getAttribute('data-act')] = Math.round(el.getBoundingClientRect().top + window.scrollY);
  });
  return { marks: m, height: document.documentElement.scrollHeight, vis: document.visibilityState };
});
console.log(JSON.stringify(marks));

// beats: [label, scrollY offset within act span]
const beats = [];
const acts = Object.entries(marks.marks).map(([k, v]) => [parseInt(k), v]).sort((a, b) => a[0] - b[0]);
for (let i = 0; i < acts.length; i++) {
  const [id, top] = acts[i];
  const bottom = i + 1 < acts.length ? acts[i + 1][1] : marks.height;
  beats.push([`act${id}-a`, Math.round(top + (bottom - top) * 0.25)]);
  beats.push([`act${id}-b`, Math.round(top + (bottom - top) * 0.7)]);
}

for (const [label, y] of beats) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await new Promise((r) => setTimeout(r, 2600)); // lenis + camera settle
  await page.screenshot({ path: `${OUT}/${label}.jpg`, quality: 70, type: 'jpeg' });
  console.log('shot', label, y);
}

// fps sample at a heavy beat
await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));
await new Promise((r) => setTimeout(r, 1500));
const fps = await page.evaluate(() => new Promise((res) => {
  let n = 0; const t0 = performance.now();
  const loop = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(loop); else res(Math.round(n / 3)); };
  requestAnimationFrame(loop);
}));
console.log('fps(hero):', fps);

await browser.close();
