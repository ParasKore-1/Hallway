import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { aboutIntro, notFound } from '@/content/about';
import { pricingIntro } from '@/content/pricing';
import { productIntro } from '@/content/product';
import { routes } from './routes';

const HOME_TITLE = 'Every tenant enquiry, answered before the kettle boils.';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>,
  );
  return router;
}

describe('app routes', () => {
  it('renders the home page with a single h1 and landmarks', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: HOME_TITLE })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('exposes the skip link as the first focusable element', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    await user.tab();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus();
  });

  it.each([
    ['/product', productIntro.title],
    ['/pricing', pricingIntro.title],
    ['/about', aboutIntro.title],
    ['/does-not-exist', notFound.title],
  ])('renders %s with one h1', async (path, title) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('moves focus to the new page h1 after navigation', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await screen.findByRole('heading', { level: 1, name: HOME_TITLE });
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const pricingLink = screen
      .getAllByRole('link', { name: 'Pricing' })
      .find((l) => nav.contains(l));
    if (!pricingLink) throw new Error('Pricing link missing from primary nav');
    await user.click(pricingLink);
    const heading = await screen.findByRole('heading', { level: 1, name: pricingIntro.title });
    await vi.waitFor(() => {
      expect(heading).toHaveFocus();
    });
  });
});
