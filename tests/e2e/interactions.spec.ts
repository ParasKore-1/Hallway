import { expect, test } from '@playwright/test';
import { skipPreloader } from './helpers';

test.beforeEach(async ({ page }) => {
  await skipPreloader(page);
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('opens, traps focus, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();

    // Tab cycles within the dialog.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('navigates and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL('/pricing');
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  });
});

test('pricing toggle switches to annual prices and announces it', async ({ page }) => {
  await page.goto('/pricing');
  const plans = page.getByRole('region', { name: 'Plans' });
  await expect(plans.getByText('£349', { exact: true })).toBeVisible();

  // The radio is visually hidden; users click its label.
  await page.locator('label', { hasText: 'Annual' }).click();
  await expect(page.getByRole('radio', { name: /Annual/ })).toBeChecked();
  await expect(plans.getByText('£279', { exact: true })).toBeVisible();
  await expect(plans.getByText('£349', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Showing annual prices, 20% lower.')).toBeAttached();
  await expect(plans.getByText('Billed annually at £3,348')).toBeVisible();

  // Keyboard: arrow keys move within the radio group.
  await page.getByRole('radio', { name: /Annual/ }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: 'Monthly' })).toBeChecked();
  await expect(plans.getByText('£349', { exact: true })).toBeVisible();
});

test('comparison is a table on desktop and stacked cards on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pricing');
  const table = page.getByRole('table', { name: 'Feature comparison of Hallway plans' });
  await expect(table).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Growth' })).toBeVisible();
  await expect(table.getByRole('rowheader', { name: 'Maintenance triage' })).toBeVisible();

  await page.setViewportSize({ width: 375, height: 800 });
  await expect(table).toBeHidden();
  await expect(page.getByRole('heading', { level: 3, name: 'Portfolio' }).last()).toBeVisible();
});

test('FAQ accordion works with the keyboard', async ({ page }) => {
  await page.goto('/pricing');
  const first = page.getByRole('button', { name: 'Does Hallway replace my negotiators?' });
  await first.focus();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('region', { name: 'Does Hallway replace my negotiators?' }),
  ).toBeVisible();

  await page.keyboard.press('ArrowDown');
  const second = page.getByRole('button', { name: 'What happens if it doesn’t know an answer?' });
  await expect(second).toBeFocused();
  await page.keyboard.press('Space');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'Is there a long contract?' })).toBeFocused();
});

test('demo tabs switch views with arrow keys', async ({ page }) => {
  await page.goto('/');
  // Like a user, reach the section first; below-the-fold sections hydrate in idle time
  // after the shell (HydrationBoundary), so wait for the page to settle.
  await page.waitForLoadState('networkidle');
  const tablist = page.getByRole('tablist', { name: 'Conversation types' });
  await tablist.scrollIntoViewIfNeeded();
  await tablist.getByRole('tab', { name: 'Enquiries' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tablist.getByRole('tab', { name: 'Viewings' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByText('Viewing moved')).toBeVisible();
});

test('book-a-demo dialog validates, submits and shows a toast', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.getByRole('banner').getByRole('button', { name: 'Book a demo' }).click();
  const dialog = page.getByRole('dialog', { name: 'Book a 20-minute demo' });
  await expect(dialog.getByLabel('Your name')).toBeFocused();

  await dialog.getByRole('button', { name: 'Request demo' }).click();
  const email = dialog.getByLabel('Work email');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAccessibleDescription(/Enter an email address/);

  await email.fill('sam@agency.co.uk');
  await dialog.getByRole('button', { name: 'Request demo' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('status').filter({ hasText: 'Demo requested' })).toBeVisible();
});

test('theme toggle switches theme and persists it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/about');
  await page.getByRole('button', { name: 'Switch to dark theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Switch to light theme' }).first()).toBeVisible();
});
