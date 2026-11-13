import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { routes } from '@/app/routes';

export interface RenderResult {
  html: string;
  head: string;
  status: number;
}

/**
 * Build-time render of one URL to static HTML (see build/prerender.ts). The output hydrates in
 * the browser, so the first paint (and LCP) never waits for JavaScript.
 */
export async function render(url: string): Promise<RenderResult> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(url, 'http://localhost')));
  if (context instanceof Response) {
    throw new Error(`Unexpected redirect while prerendering ${url}`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const helmetContext: { helmet?: HelmetServerState | null } = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouterProvider router={router} context={context} />
      </HelmetProvider>
    </StrictMode>,
  );

  const helmet = helmetContext.helmet;
  const head = helmet
    ? [
        helmet.title.toString(),
        // prioritizeSeoTags moves description, canonical and og:* into `priority`.
        helmet.priority.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
      ].join('\n')
    : '';
  return { html, head, status: context.statusCode };
}
