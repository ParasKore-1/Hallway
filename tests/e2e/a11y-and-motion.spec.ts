import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { routes, scrollThrough, skipPreloader } from './helpers';

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

const pages = [...routes.map((r) => r.path), '/not-a-page'];

for (const theme of ['light', 'dark'] as const) {
  for (const path of pages) {
    test(`axe: ${path} has no violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(path);
      await scrollThrough(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target.join(' ')),
        })),
      ).toEqual([]);
    });
  }
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const route of routes) {
    test(`${route.path}: all content renders and nothing is left hidden`, async ({ page }) => {
      await page.goto(route.path);
      await scrollThrough(page);
      // Every section heading is visible and fully opaque after scrolling through.
      const headings = page.locator('main h2:not(.sr-only)');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i += 1) {
        const heading = headings.nth(i);
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect
          .poll(() =>
            heading.evaluate((el) => Number(getComputedStyle(el.closest('[style]') ?? el).opacity)),
          )
          .toBe(1);
      }
      // Smooth scrolling, preloader and custom cursor are all off.
      await expect(page.locator('html')).not.toHaveClass(/lenis/);
      await expect(page.locator('html')).not.toHaveClass(/is-preloading/);
    });
  }

  test('home: the signature arch is shown open and the steps are not pinned', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const clip = await page.locator('.hero-arch').evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip).toBe('none');
    await expect(page.locator('section[aria-labelledby="how-title"]')).not.toHaveAttribute(
      'data-pinned',
      'true',
    );
  });
});

test('full motion: "How it works" pins and scrolls horizontally on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="how-title"]');
  await expect(section).toHaveAttribute('data-pinned', 'true');
  const track = section.locator('[data-track]');
  await section.scrollIntoViewIfNeeded();
  const before = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  await page.mouse.wheel(0, 1600);
  await expect
    .poll(() => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41))
    .toBeLessThan(before - 100);
});
