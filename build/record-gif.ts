/**
 * Records docs/hero.gif: the first-visit preloader handing off to the hero, then the
 * signature arch opening as the page scrolls. Requires a running `pnpm preview` on :4173.
 * Frames are captured with Playwright and joined into an animated GIF with sharp.
 */
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const width = 1280;
const height = 760;
const scale = 0.5;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const frames: Buffer[] = [];
const grab = async () => {
  frames.push(await page.screenshot({ type: 'png', scale: 'css' }));
};

await page.goto('http://localhost:4173/', { waitUntil: 'commit' });
// Preloader + intro: ~1.8s at ~12 fps.
for (let i = 0; i < 22; i += 1) {
  await grab();
  await page.waitForTimeout(70);
}
await page.waitForTimeout(400);
// Scroll through the arch reveal.
for (let i = 0; i < 26; i += 1) {
  await page.mouse.wheel(0, 40);
  await page.waitForTimeout(60);
  await grab();
}
for (let i = 0; i < 6; i += 1) {
  await page.waitForTimeout(120);
  await grab();
}
await browser.close();

const resized = await Promise.all(
  frames.map((frame) =>
    sharp(frame)
      .resize(Math.round(width * scale), Math.round(height * scale))
      .png()
      .toBuffer(),
  ),
);
await mkdir(join(root, 'docs'), { recursive: true });
await sharp(resized, { join: { animated: true } })
  .gif({ delay: resized.map((_, i) => (i === resized.length - 1 ? 1500 : 80)), loop: 0, effort: 7 })
  .toFile(join(root, 'docs', 'hero.gif'));
console.log(`wrote docs/hero.gif (${frames.length} frames)`);
