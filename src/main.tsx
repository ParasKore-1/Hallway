import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter/wght.css';
import '@/styles/globals.css';

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, type HydrationState } from 'react-router';
import { App } from '@/app/App';
import { routes } from '@/app/routes';

declare global {
  interface Window {
    __staticRouterHydrationData?: HydrationState;
  }
}

const KNOWN_PATHS = new Set(['/', '/product', '/pricing', '/about', '/playground']);

function isKnownPath(path: string): boolean {
  return KNOWN_PATHS.has(path);
}

async function start(): Promise<void> {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element #root not found in index.html');

  // Prerendered pages: resolve the lazy route modules for this URL *before* hydrating,
  // so the first client render matches the static HTML exactly.
  const matches = matchRoutes(routes, window.location) ?? [];
  await Promise.all(
    matches.map(async ({ route }) => {
      if (typeof route.lazy !== 'function') return;
      const resolved = await route.lazy();
      Object.assign(route, { ...resolved, lazy: undefined });
    }),
  );

  const router = createBrowserRouter(routes, {
    ...(window.__staticRouterHydrationData
      ? { hydrationData: window.__staticRouterHydrationData }
      : {}),
  });
  const app = (
    <StrictMode>
      <App router={router} />
    </StrictMode>
  );

  // Hydrate only when the static HTML was rendered for this URL. If a host served another
  // page's HTML (e.g. an SPA fallback to index.html for an unknown path), render fresh instead
  // of hydrating mismatched markup.
  const prerendered = container.dataset.prerendered;
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const matchesUrl = prerendered === path || (prerendered === '/404' && !isKnownPath(path));
  if (container.hasChildNodes() && matchesUrl) {
    // Hydrate synchronously, not in a transition: a time-sliced hydration lets the browser
    // dispatch a tap between slices before React has attached handlers, and that tap is lost.
    // Synchronous hydration queues the tap until handlers exist (DECISIONS 019).
    hydrateRoot(container, app);
  } else {
    container.replaceChildren();
    createRoot(container).render(app);
  }
}

void start();
