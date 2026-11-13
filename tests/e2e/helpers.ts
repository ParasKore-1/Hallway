import type { Page } from '@playwright/test';

/** Mark the session as visited so the first-visit preloader doesn't run. */
export async function skipPreloader(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem('hallway-visited', '1');
  });
}

/**
 * Scroll through the page so once-only scroll reveals fire, then return to the top.
 * Motion setups are created lazily (near the viewport, one per task), so pause at each step
 * and at the bottom to let queued setups run before scrolling away from them.
 */
export async function scrollThrough(page: Page): Promise<void> {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => {
      window.scrollTo(0, top);
    }, y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  // Under parallel test load, queued setups can run late. Hold at the bottom (where any
  // late setup sees its element as already passed and leaves it visible) until no reveal is
  // still at its hidden start state, so nothing is waiting for a scroll that won't come.
  await page
    .waitForFunction(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('main [style*="opacity"]')).every(
          (el) => getComputedStyle(el).opacity !== '0',
        ),
      undefined,
      { timeout: 8000, polling: 200 },
    )
    .catch(() => undefined);
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

export const routes = [
  { path: '/', h1: 'Every tenant enquiry, answered before the kettle boils.' },
  { path: '/product', h1: 'One quiet layer between your tenants and your team.' },
  { path: '/pricing', h1: 'Priced per portfolio, not per headache.' },
  { path: '/about', h1: 'Built by people who have answered the 2 a.m. boiler call.' },
] as const;
