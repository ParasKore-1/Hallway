# Contributing — Hallway marketing site

## Project goal

A portfolio-grade, award-quality marketing website for **Hallway**, a _fictional_ AI operations
platform for UK letting agents and property managers (tenant enquiries, viewings, maintenance
requests, rent reminders via AI chat). Frontend only, statically deployed.

Everything is original: copy, layout, name, logo, illustrations. Never copy another company's
site, wording, assets or distinctive layouts. All people, agencies, testimonials and statistics
are fictional and labelled as such where a reader could mistake them for real.

Companion docs: `DESIGN.md` (tokens + visual concept), `PLAN.md` (phase checklists),
`DECISIONS.md` (append-only decision log — **add an entry for every non-obvious choice**).

## Stack (fixed — do not substitute)

| Concern                    | Choice                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Framework                  | React 18 + Vite + TypeScript (`strict`, `noUncheckedIndexedAccess`, no `any`)                                    |
| Styling                    | Tailwind CSS v4 (`@tailwindcss/vite`), `@theme` reads CSS custom properties from `src/styles/tokens.css`         |
| Variants                   | `tailwind-variants` (or `cva`) + `tailwind-merge` via a `cn()` helper                                            |
| Scroll motion              | GSAP + ScrollTrigger, Lenis (single RAF loop driven by `gsap.ticker`)                                            |
| Component motion           | Framer Motion (`motion/react`) — micro-interactions, `AnimatePresence` route transitions                         |
| Routing                    | React Router — `/`, `/product`, `/pricing`, `/about`, `/playground`, `*` (404)                                   |
| 3D (optional, one element) | `@react-three/fiber` v8 + `drei` (v8 is the React 18 line), lazy-loaded with static fallback                     |
| Fonts                      | `@fontsource-variable/*`, self-hosted, display font preloaded                                                    |
| SEO                        | `react-helmet-async`, `sitemap.xml`, `robots.txt`, OG image                                                      |
| Tests                      | Vitest + React Testing Library + jest-dom; Playwright (visual snapshots at 375/768/1280/1920)                    |
| Quality                    | ESLint flat config (typescript-eslint, jsx-a11y, react-hooks), Prettier (+ tailwind plugin), Husky + lint-staged |
| CI                         | GitHub Actions (pnpm, cached): typecheck → lint → unit → build → Playwright → Lighthouse CI                      |
| Deploy                     | Any static host serving `dist/` (see README → Deploying)                                                         |
| Package manager            | pnpm                                                                                                             |

## Folder structure

```
src/
  app/                 App root, providers, router, RouteTransition, ScrollManager
  routes/              One file per route (Home.tsx, Product.tsx, …) — default exports allowed here only
  components/
    ui/                Primitives (Button, Heading, Accordion, Modal, …)
    sections/          Page sections (HeroSection, BentoSection, …), grouped by page if needed
    motion/            Motion helpers (SplitReveal, Magnetic, Counter, Marquee internals, Cursor)
    layout/            Navbar, Footer, SkipLink, PageShell
  hooks/               useGsapContext, useReducedMotion, useLenis, useMediaQuery, …
  lib/                 Pure utilities (cn, gsap registration, format, env)
  styles/              tokens.css, globals.css, fonts.css
  assets/              SVG logos, images (AVIF/WebP + fallbacks)
  content/             Typed marketing copy (home.ts, pricing.ts, …) — no copy hard-coded in JSX
tests/e2e/             Playwright specs + snapshots
public/                robots.txt, sitemap.xml, og.png, favicons
```

## Coding conventions

- **One component per file.** File name = component name, PascalCase (`PricingCard.tsx`).
- **Named exports only**, except route modules in `src/routes` (default export for `React.lazy`).
- Props typed with an `interface` named `<Component>Props`; extend native element props
  (`ComponentPropsWithoutRef<'button'>`) instead of re-declaring them.
- `forwardRef` on every primitive that renders a focusable/DOM element consumers may need.
- Polymorphism via `asChild` (Radix `Slot` pattern) or a typed `as` prop — never `any`.
- **Co-located tests**: `Button.tsx` + `Button.test.tsx` in the same folder.
- Hooks start with `use`, live in `src/hooks` unless private to one component.
- Content lives in `src/content/*.ts` as typed objects (`satisfies` a content interface).
- Path alias `@/` → `src/`. No deep relative imports (`../../..`).
- No magic numbers in styles: use spacing/type/radius/motion tokens. Arbitrary Tailwind values
  require a comment justifying them.
- Strict TS: no `any`, no non-null `!` without a comment, no `@ts-ignore` (use `@ts-expect-error` + reason).
- Prettier formats; ESLint must pass with zero warnings in CI.

## Animation rules

1. Animate **only** `transform`, `opacity`, `clip-path` (and CSS variables that feed those).
   Never animate width/height/top/left/margin/box-shadow/filter on scroll.
2. `will-change` is applied at animation start and removed on complete — never left in CSS.
3. Every GSAP usage goes through `useGsapContext` (`gsap.context()` scoped to a ref);
   `ctx.revert()` on unmount kills tweens **and** ScrollTriggers.
4. Responsive motion uses `gsap.matchMedia()` (e.g. pinned horizontal scroll ≥1024px only).
5. **One RAF loop**: Lenis is ticked by `gsap.ticker`; `lenis.on('scroll', ScrollTrigger.update)`.
6. Every effect ships a **reduced-motion variant** (not just "off"): e.g. masked reveals → short
   opacity fade, parallax → static, counters → final value, curtain wipe → crossfade, Lenis disabled.
7. Lenis is stopped while a modal/drawer is open and for reduced-motion users.
8. Final content is in the DOM before animation (SEO + screen readers); animations start from
   `gsap.set` states applied in a layout effect to avoid flashes. No content gated on JS-only reveals.
9. Pointer effects (cursor, magnetic, tilt, spotlight) only on `(pointer: fine)`; throttle with rAF.
   The custom cursor never hides the native cursor.
10. Durations/easings come from motion tokens (`--dur-*`, `--ease-*`), mirrored in `src/lib/motion.ts`.

## Accessibility rules

- Landmarks: one `<header>`, `<nav aria-label>`, `<main id="main" tabindex="-1">`, `<footer>`.
- Skip link is the first focusable element.
- One `h1` per page; headings never skip levels. `Heading` decouples semantic `level` from visual `size`.
- Sections: `<section aria-labelledby="…">` pointing at their heading.
- Native HTML first; ARIA only where native is insufficient (tabs, accordion, dialog follow WAI-ARIA APG).
- Focus: visible brand focus ring (`--focus-ring`) on `:focus-visible` in both themes, ≥3:1 against adjacent colours.
- Dialogs: focus trap, `Esc` closes, scroll lock, focus returns to trigger.
- Route change: focus moves to the new page's `h1`, title updates, scroll restored correctly.
- All images have meaningful `alt` or `alt=""` if decorative; decorative SVGs `aria-hidden="true"`.
- Colour contrast AA minimum (4.5:1 body, 3:1 large text & UI) in both themes — see DESIGN.md.
- Target size ≥ 24×24 CSS px (44×44 for primary touch targets).
- Animated counters and marquees are not announced (`aria-hidden` on the animated copy, real value in DOM).
- Marquee pauses on hover/focus; respects reduced motion.

## Quality bars (non-negotiable)

- Lighthouse mobile: **Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100**.
- **LCP < 2.5s, CLS < 0.05, INP < 200ms** on a mid-range mobile profile.
- Every animation respects `prefers-reduced-motion` with a designed reduced variant.
- Fully keyboard navigable; brand focus rings; semantic landmarks; skip link; correct heading order.
- Pixel-careful at **320, 375, 768, 1024, 1280, 1440, 1920** — no horizontal scroll at any width;
  fluid type via `clamp()`; container queries where components live in variable-width slots.
- No layout shift from fonts (`font-display: swap` + metric-matched fallback, preload display font)
  or images (explicit `width`/`height`, `aspect-ratio`).
- Animations on transform/opacity/clip-path only; no scroll jank; GSAP contexts reverted on unmount.
- Bundle budgets (gzipped, enforced in Lighthouse CI / size check): initial JS ≤ 170 kB,
  per-route chunk ≤ 60 kB, 3D chunk loaded only on demand.

## Commands

```
pnpm dev          # Vite dev server (client-rendered; no prerender in dev)
pnpm build        # typecheck → client build → SSR build → prerender every route (dist/)
pnpm preview      # serve dist exactly as a static host would (prerendered routes, 404.html)
pnpm typecheck    # tsc -b --noEmit
pnpm lint         # eslint . --max-warnings 0
pnpm test         # vitest run (unit + component)
pnpm e2e          # playwright test (needs pnpm build) — e2e, axe, visual snapshots
pnpm lhci         # Lighthouse CI with budgets (needs pnpm build; set CHROME_PATH locally)
pnpm analyze      # writes stats.html bundle treemap
pnpm og           # regenerate public/og.png
pnpm gif          # record docs/hero.gif (needs pnpm preview running)
```

## Rendering & motion architecture (read before touching motion)

- Pages are **prerendered** (`build/prerender.ts`). Every component must render identically on
  server and client: no `window` in render, use `useMediaQuery`/`useTheme`/`useIsClient`.
- GSAP/ScrollTrigger, Lenis and Framer Motion's engine are **lazy chunks**. Never
  `import { gsap } from 'gsap'` in a component — use `useGsapContext(({ gsap, ... }) => …)`.
- `useGsapContext` runs setups one per task and, unless `{ eager: true }`, only when the
  element nears the viewport. Use `eager` for above-the-fold intros and for pins.
- Never hide already-painted content: start-hidden entrance animations must check
  `isCovered()` (preloader or route curtain) — see `src/lib/intro.ts`.
- Use `m.*` (not `motion.*`) inside `LazyMotion strict`.

## Workflow

- Work one phase at a time from PLAN.md; tick boxes as items land.
- Append to DECISIONS.md whenever a choice isn't obvious from this file.
- Before marking a phase done: typecheck, lint, tests and build all pass.
