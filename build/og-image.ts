/**
 * Generates public/og.png (1200×630) from an SVG using the brand palette.
 * Run with `pnpm og` when the brand or tagline changes; the PNG is committed.
 * Text is set in Georgia/Arial so the render doesn't depend on webfonts being installed.
 */
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f6f2eb"/>
  <!-- Signature arch, cropped by the right edge -->
  <path d="M870 630V370a230 230 0 0 1 460 0v260z" fill="#1e4a41"/>
  <path d="M925 630V380a175 175 0 0 1 350 0v250z" fill="none" stroke="#f6f2eb" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="1160" cy="500" r="12" fill="#e3b66b"/>
  <!-- Wordmark -->
  <path d="M80 118V82a24 24 0 0 1 48 0v36z" fill="#1e4a41"/>
  <circle cx="113" cy="98" r="3.6" fill="#e3b66b"/>
  <text x="146" y="114" font-family="Georgia, serif" font-size="40" fill="#16181d">Hallway</text>
  <!-- Headline -->
  <text font-family="Georgia, serif" font-size="72" fill="#16181d" letter-spacing="-1.5">
    <tspan x="80" y="282">Every tenant enquiry,</tspan>
    <tspan x="80" y="372">answered before</tspan>
    <tspan x="80" y="462">the kettle boils.</tspan>
  </text>
  <text x="80" y="552" font-family="Arial, sans-serif" font-size="26" fill="#4f535c">AI operations for UK letting agents</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(join(root, 'public', 'og.png'), png);
console.log(`wrote public/og.png (${Math.round(png.length / 1024)} kB)`);
