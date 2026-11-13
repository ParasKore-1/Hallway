import { expect, test } from '@playwright/test';
import { scrollThrough, skipPreloader } from './helpers';

/**
 * Visual regression at the four reference widths. Motion is reduced (deterministic frames),
 * the theme is forced light, and the marquee is static under reduced motion.
 */
const widths = [375, 768, 1280, 1920] as const;
const pages = [
  { name: 'home', path: '/' },
  { name: 'pricing', path: '/pricing' },
] as const;

test.use({ reducedMotion: 'reduce', colorScheme: 'light' });

for (const { name, path } of pages) {
  for (const width of widths) {
    test(`${name} @ ${width}px`, async ({ page }) => {
      await skipPreloader(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      // Chrome's full-page capture doesn't paint sections skipped by content-visibility
      // (.defer-render); real users see them render as they near the viewport.
      await page.addStyleTag({
        content: '* { content-visibility: visible !important; }',
      });
      await page.evaluate(() => document.fonts.ready);
      await scrollThrough(page);
      await expect(page).toHaveScreenshot(`${name}-${width}.png`, { fullPage: true });
    });
  }
}
