import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { preloadFonts } from './build/preloadFonts';
import { previewPrerendered } from './build/previewPrerendered';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    preloadFonts([/fraunces-latin-opsz-normal/, /inter-latin-wght-normal/]),
    previewPrerendered(),
    // `pnpm analyze` writes stats.html (treemap of every chunk, with gzip sizes).
    mode === 'analyze' && visualizer({ filename: 'stats.html', gzipSize: true, brotliSize: true }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    // Keep font files as separate (preloadable, cacheable) assets rather than base64-inlining them.
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
  },
  // The prerender bundle is self-contained so Node never has to resolve browser-first packages.
  ssr: { noExternal: true },
}));
