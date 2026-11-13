import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * `vite preview` would answer every extensionless path with dist/index.html (SPA fallback).
 * Serve the prerendered page for the route instead — /pricing → dist/pricing/index.html,
 * unknown paths → dist/404.html — so local preview, e2e tests and Lighthouse see exactly what
 * a static host serves.
 */
export function previewPrerendered(outDir = 'dist'): Plugin {
  return {
    name: 'hallway:preview-prerendered',
    configurePreviewServer(server) {
      const root = resolve(server.config.root, outDir);
      server.middlewares.use((req, _res, next) => {
        const [path = '/', query = ''] = (req.url ?? '/').split('?');
        if (path !== '/' && !path.includes('.')) {
          const clean = path.replace(/\/+$/, '');
          const page = join(root, clean, 'index.html');
          const target = existsSync(page) ? `${clean}/index.html` : '/404.html';
          req.url = query ? `${target}?${query}` : target;
        }
        next();
      });
    },
  };
}
