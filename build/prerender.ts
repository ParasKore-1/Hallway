/**
 * Post-build static prerender.
 *   1. `vite build`                       → dist/ (client, with index.html template)
 *   2. `vite build --ssr src/entry-server` → dist-ssr/entry-server.js
 *   3. this script renders every route into dist/<route>/index.html (+ dist/404.html),
 *      injects per-route <head> tags, and writes sitemap.xml + robots.txt.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

interface RenderResult {
  html: string;
  head: string;
  status: number;
}
interface ServerEntry {
  render: (url: string) => Promise<RenderResult>;
}

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const siteUrl = (process.env.VITE_SITE_URL ?? 'http://localhost:5173').replace(/\/+$/, '');

const pages: { url: string; file: string; sitemap: boolean }[] = [
  { url: '/', file: 'index.html', sitemap: true },
  { url: '/product', file: 'product/index.html', sitemap: true },
  { url: '/pricing', file: 'pricing/index.html', sitemap: true },
  { url: '/about', file: 'about/index.html', sitemap: true },
  { url: '/playground', file: 'playground/index.html', sitemap: false },
  { url: '/404', file: '404.html', sitemap: false },
];

const template = await readFile(join(dist, 'index.html'), 'utf8');
const entry = (await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)) as ServerEntry;

for (const page of pages) {
  const { html, head } = await entry.render(page.url);
  const output = template
    // Per-route head replaces the template's default title/description.
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '')
    .replace('</head>', `${head}\n</head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-prerendered="${page.url}">${html}</div>`,
    );
  const target = join(dist, page.file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output);
  console.log(`prerendered ${page.url.padEnd(12)} → dist/${page.file}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((p) => p.sitemap)
  .map((p) => `  <url><loc>${siteUrl}${p.url}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /playground\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
await rm(ssrDir, { recursive: true, force: true });
console.log('wrote sitemap.xml and robots.txt');
