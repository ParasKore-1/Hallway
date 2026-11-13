import { expect, test } from '@playwright/test';
import { routes, skipPreloader } from './helpers';

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

for (const route of routes) {
  test(`${route.path} is prerendered with its own title and h1`, async ({ request }) => {
    const response = await request.get(route.path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('data-prerendered');
    // The home headline is split into per-word spans for its reveal, so match one word.
    expect(html).toContain(route.h1.split(' ').at(-1) ?? '');
    expect(html).toMatch(/<link[^>]*rel="canonical"/);
    expect(html).toMatch(/<meta[^>]*property="og:title"/);
    expect(html).toMatch(/<meta[^>]*name="description"/);
  });
}

test('navigates between pages with the primary nav, moving focus to the new h1', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });

  for (const route of routes.slice(1)) {
    const label = route.path.slice(1).replace(/^./, (c) => c.toUpperCase());
    await nav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(route.path);
    const heading = page.getByRole('heading', { level: 1, name: route.h1 });
    await expect(heading).toBeFocused();
    await expect(page).toHaveTitle(new RegExp(`^${label} · Hallway$`));
    await expect(nav.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
  }
});

test('back navigation restores the previous page', async ({ page }) => {
  await page.goto('/pricing');
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'About' })
    .click();
  await expect(page).toHaveURL('/about');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: routes[2].h1 })).toBeVisible();
});

test('unknown URLs render the 404 page with links home', async ({ page }) => {
  await page.goto('/this-door-goes-nowhere');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'This door doesn’t lead anywhere.',
  );
  await page
    .getByRole('navigation', { name: 'Suggested pages' })
    .getByRole('link', { name: 'Homepage' })
    .click();
  await expect(page).toHaveURL('/');
});

test('skip link moves focus to main content', async ({ page }) => {
  await page.goto('/pricing');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('first visit shows the preloader once, then never again this session', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // Check as soon as the document commits: the preloader window is only ~1.15s.
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveClass(/is-preloading/);
  await expect(page.locator('html')).not.toHaveClass(/is-preloading/, { timeout: 3000 });
  expect(await page.evaluate(() => sessionStorage.getItem('hallway-visited'))).toBe('1');

  await page.reload({ waitUntil: 'commit' });
  await expect(page.locator('html')).not.toHaveClass(/is-preloading/);
  await context.close();
});
