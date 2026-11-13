import type { HtmlTagDescriptor, Plugin } from 'vite';

/**
 * Injects <link rel="preload"> for the critical font files emitted by the build.
 * Fontsource assets are content-hashed, so their URLs cannot be hard-coded in index.html.
 * Only the latin subsets used above the fold are preloaded (display + text).
 */
export function preloadFonts(patterns: readonly RegExp[]): Plugin {
  return {
    name: 'hallway:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx): HtmlTagDescriptor[] {
        const bundle = ctx.bundle;
        if (!bundle) return [];
        return Object.values(bundle)
          .filter(
            (chunk) =>
              chunk.type === 'asset' &&
              chunk.fileName.endsWith('.woff2') &&
              patterns.some((pattern) => pattern.test(chunk.fileName)),
          )
          .map((asset) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: `/${asset.fileName}`,
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head-prepend',
          }));
      },
    },
  };
}
