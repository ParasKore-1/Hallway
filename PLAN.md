# PLAN.md — Hallway

Work one phase at a time. A phase is done when typecheck, lint, tests and build pass and
the checklist is ticked. Log non-obvious choices in DECISIONS.md as you go.

## Phase 0 — Planning docs ✅

- [x] CONTRIBUTING.md (goal, stack, structure, conventions, animation + a11y rules, quality bars)
- [x] DESIGN.md (palette + contrast, type, spacing, radius, shadows, motion, concept, signature interaction)
- [x] PLAN.md
- [x] DECISIONS.md template

## Phase 1 — Scaffold, tooling, tokens, fonts, CI skeleton ✅

- [x] `git init`, `.gitignore`, `.editorconfig`, `.nvmrc` (Node 22), `packageManager` pinned (pnpm 9)
- [x] Vite + React 18 + TS scaffold; `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- [x] Path alias `@/` in tsconfig + Vite
- [x] Folder structure: `src/{app,routes,components/{ui,sections,motion,layout},hooks,lib,styles,assets,content}`
- [x] Tailwind v4 via `@tailwindcss/vite`; `@theme` wired to tokens
- [x] `src/styles/tokens.css`: light + dark (`[data-theme="dark"]` + `prefers-color-scheme` default)
- [x] Fluid type scale with `clamp()`; spacing, radius, shadow, motion tokens; `src/lib/motion.ts` mirror
- [x] Fonts via `@fontsource-variable/fraunces` + `inter`; preload display woff2; metric-matched fallbacks
- [x] No-flash theme script in `index.html` (reads stored preference before paint)
- [x] React Router skeleton with lazy routes: Home, Product, Pricing, About, Playground, 404
- [x] `src/content/` typed content pattern + `site.ts` (name, nav, meta)
- [x] Typed env module (`VITE_SITE_URL`), `.env.example`
- [x] ESLint flat config (typescript-eslint strict, jsx-a11y, react-hooks, react-refresh), Prettier + tailwind plugin
- [x] Husky + lint-staged pre-commit
- [x] Vitest + RTL + jest-dom setup with one smoke test
- [x] GitHub Actions: pnpm install (cached) → typecheck → lint → test → build
- [x] README stub (run locally, env vars)
- [x] Verify `pnpm dev` and `pnpm build` pass

## Phase 2 — Component library + /playground ✅

- [x] `cn()` (clsx + tailwind-merge taught the custom token names), `cva` variants, Radix `Slot`/`Slottable` for `asChild` — _cva chosen over tailwind-variants (smaller, no runtime config)_
- [x] Button (primary/secondary/ghost/link; sm/md/lg/icon; loading with `aria-busy`; icon slots; `asChild`)
- [x] Container, Section, Heading (level ≠ size), Text, Badge, Tag, Card
- [x] Link (router `NavLink` internally, plain router link for `#hash` targets, external with `rel` + "opens in a new tab")
- [x] Accordion (APG; ↑/↓/Home/End; heading level configurable)
- [x] Tabs (APG, automatic activation, roving tabindex, controlled/uncontrolled)
- [x] Tooltip (hover + focus, Esc, hoverable/persistent per WCAG 1.4.13)
- [x] Marquee (CSS transform loop, pauses on hover/focus, explicit Pause button, static wrap under reduced motion)
- [x] Modal / Drawer (focus trap, Esc, scroll lock incl. Lenis, `inert` app root, focus return)
- [x] Navbar (hide-on-scroll, animated full-screen mobile menu), Footer, SkipLink, ThemeToggle, Toast (`aria-live`, pause on hover/focus)
- [x] All interactive states: hover, focus-visible, active, disabled, loading
- [x] `/playground`: every component × state, side-by-side light/dark panels (nested `[data-theme]`), noindex
- [x] RTL tests: Button, Accordion, Tabs, Modal (keyboard + focus) — 19 tests

## Phase 3 — Home page ✅

- [x] Hero: editorial headline (highlighted "answered"), sub-copy, 2 CTAs, HTML/CSS inbox mock, fictional SVG wordmarks
- [x] Problem → solution split with illustrative stats + footnote (marked `*`, sr-only "illustrative figure")
- [x] Features bento (6 cards, varied spans, live UI vignettes)
- [x] How it works — 4 steps (grid; pinned horizontal ≥1024px)
- [x] Interactive demo — Tabs: Enquiries / Viewings / Maintenance
- [x] Metrics band (dark section)
- [x] Testimonials (fictional people, "Fictional" badge, initials avatars)
- [x] Integrations orbit (≥1024px) / chip grid (below)
- [x] Pricing teaser + FAQ accordion
- [x] Closing CTA in an arched panel + footer
- [x] Semantic audit: landmarks, `section[aria-labelledby]`, one h1, heading order (unit + e2e tested)
- [x] Responsive check 320 / 375 / 768 / 1024 / 1280 / 1440 / 1920 — issues found and fixed:
  - hero headline wrapped one word per line (`.line-mask` forced `display:block` over `inline-block`)
  - reduced-motion logo marquee didn't wrap (inner list kept `flex-nowrap`), so logos were clipped
  - integration orbit `<li>` boxes overflowed the viewport by 39px at 1280 (collapsed to `size-0`)
  - scrollbar gutter showed white (no background on `html`)
  - "Fictional" badge on the green card ≈3.8:1 contrast (now white-on-tint)

## Phase 4 — Motion layer ✅

- [x] Hooks: `useReducedMotion`, `useGsapContext` (gsap.matchMedia scope, lazy GSAP, one setup per task, IO-deferred), `useLenis`
- [x] Lenis ↔ ScrollTrigger on one RAF loop (`gsap.ticker`); stops on modal; off for reduced motion; created on first wheel
- [x] Preloader (≈1.15s, home, first visit per session) → hero intro handoff
- [x] Hero masked word reveal (staggered), brass marker draw
- [x] **Signature:** arched doorway opens on scroll (clip-path scrub) as the last replies arrive
- [x] Hero parallax chips + pointer tilt on the mock (desktop, fine pointer)
- [ ] ~~Optional R3F object~~ — dropped on purpose (DECISIONS 002)
- [x] Custom cursor (fine pointer, native cursor kept), magnetic CTAs, label morph over the demo ("Explore") and story ("Scroll")
- [x] How it works: pinned horizontal scroll ≥1024px via `gsap.matchMedia`, progress rule
- [x] Bento: clip-path reveal + rAF-throttled transform-only spotlight
- [x] Metric counters (in-view start, final value in HTML + sr-only, digits aria-hidden)
- [x] Closing CTA kinetic type (letters rise, rule draws)
- [x] Logo marquee
- [x] Route transitions: arch curtain via AnimatePresence + `useOutlet`, scroll restore (POP) / reset, focus to h1
- [x] Magnetic buttons, underline-draw links
- [x] Reduced-motion variant for every effect; contexts reverted on unmount
- [x] Profile: 60 fps scroll, 0 long tasks during scroll (`pnpm perf`); load-time long tasks reduced (DECISIONS 014–020)

## Phase 5 — Product, Pricing, About, 404 ✅

- [x] Product: sticky scroll-story (IntersectionObserver), mock swaps per step; mobile = mock under each step
- [x] Pricing: native-radio monthly/annual toggle, rolling price, `aria-live` announcement; `<table>` (scoped headers) ≥768px → stacked cards below
- [x] About: timeline, values, fictional team grid
- [x] Creative 404 (doorway to "nowhere", suggested pages)

## Phase 6 — Polish pass ✅

- [x] Spacing from tokens (Tailwind default scales cleared so off-token values don't exist)
- [x] Typography: prose measure, `text-wrap: balance/pretty`, curly quotes throughout
- [x] All interaction states; focus rings visible in both themes
- [x] Contrast AA in both themes — axe: 0 violations on every route, light + dark
- [x] Images: the site has no photographic images (all UI is HTML/CSS/SVG); OG image is a 49 kB PNG — AVIF/srcset not applicable
- [x] Code-split routes; GSAP/ScrollTrigger/Lenis lazy; `pnpm analyze` treemap; entry 139 kB gz
- [x] SEO: prerendered per-route title/description/canonical/OG/Twitter, OG image, sitemap.xml, robots.txt
- [x] No horizontal scroll at 320–1920 (checked at 320, 375, 768, 1024, 1280, 1366, 1440, 1920)

## Phase 7 — Tests, Lighthouse CI, docs ✅

- [x] Playwright: navigation + focus, prerendered HTML, back nav, 404, skip link, preloader once, mobile menu (trap/Esc/return focus), pricing toggle, comparison table/cards, FAQ keyboard, demo tabs, demo dialog validation + toast, theme persistence, reduced motion renders all content, desktop pin — 33 tests
- [x] axe on every route × both themes
- [x] Visual snapshots at 375 / 768 / 1280 / 1920 (home + pricing), run on one worker
- [x] Lighthouse CI with budgets, median-run aggregation, fails the build on miss
- [x] CI: verify → e2e + lighthouse jobs
- [x] Hosting notes in README (host-agnostic static output)
- [x] README: hero GIF, results table, stack, architecture diagram, interesting problems, run locally
- [x] DECISIONS.md finalised (21 records)
- [x] Final Lighthouse scores reported (README "Results")
