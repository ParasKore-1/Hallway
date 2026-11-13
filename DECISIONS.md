# DECISIONS.md

Append-only log of non-obvious choices. Newest at the bottom. Copy the template for each entry.

```md
### NNN — Title

- **Date:**
- **Phase:**
- **Decision:**
- **Options considered:**
  1. …
  2. …
- **Why:**
- **Trade-off:**
```

---

### 001 — Host-agnostic static output

- **Date:** 2026-11-13
- **Phase:** 0
- **Decision:** The repo produces a static `dist/` and documents what any host needs (route files, 404 page, cache headers, `VITE_SITE_URL`) in the README, rather than shipping one provider's config.
- **Options considered:**
  1. Ship Vercel/Netlify config plus deploy steps.
  2. Stay host-agnostic and document the requirements.
- **Why:** Keeping deployment separate from the codebase avoids provider lock-in, and the same `dist/` works on Netlify, Vercel, Cloudflare Pages or S3.
- **Trade-off:** No host-specific config (e.g. `_redirects` or `vercel.json`) is committed; cache headers are set in the host's dashboard.

### 002 — No 3D element in the hero

- **Date:** 2026-11-13
- **Phase:** 0
- **Decision:** Skip the optional `@react-three/fiber` object. The signature arch-reveal carries the hero.
- **Options considered:**
  1. Lazy-loaded R3F object with a static fallback.
  2. No 3D.
- **Why:** three.js adds about 150 kB gzipped even when lazy-loaded, plus GPU work on mid-range phones. That threatens Performance ≥ 90 and INP < 200 ms for a decorative extra. The arch reveal is cheaper and more on-concept.
- **Trade-off:** One less "wow" checkbox. It can be revisited in Phase 6 if there is budget left.

### 003 — Pinned major versions: React Router 7, TypeScript 5.9, Vite 7, Vitest 3

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** Pin `react-router@^7`, `typescript@~5.9`, `vite@^7`, `@vitejs/plugin-react@^5`, `vitest@^3`, `eslint@^9`.
- **Options considered:**
  1. Install the latest of everything.
  2. Pin to the newest majors compatible with the fixed React 18 constraint and the lint toolchain.
- **Why:** React Router 8 requires React ≥ 19.2. typescript-eslint supports TypeScript `<6.1`, so TS 7 would break type-aware linting. `@vitejs/plugin-react@6` requires Vite 8, so the Vite/plugin/Vitest set is pinned as a matching group.
- **Trade-off:** We miss the newest majors. Upgrading is a single coordinated bump once the stack moves to React 19.

### 004 — `react-router` v7 data router with `lazy` routes

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** `createBrowserRouter` plus a route-object config (`src/app/routes.tsx`). Each page is a default-exported module loaded through `lazy`.
- **Options considered:**
  1. `<BrowserRouter>` + `<Routes>` + `React.lazy`/`Suspense`.
  2. Data router with route-level `lazy`.
- **Why:** Route-level `lazy` loads the chunk _before_ the navigation commits. The old page stays put until the new one is ready, so there are no Suspense spinners or fallback flashes, and the Phase 4 curtain wipe gets a clean handoff point. It also gives built-in `<ScrollRestoration>`. The same `routes` array is reused in tests with `createMemoryRouter`.
- **Trade-off:** Slightly more ceremony (the `lazyRoute` adapter). The `ExportDefaultDeclaration` lint rule is relaxed for `src/routes/**` only.

### 005 — Token layer: `--hw-*` raw variables, Tailwind `@theme inline` mapping

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** All design values live as `--hw-*` custom properties in `tokens.css`. `globals.css` maps them into Tailwind namespaces with `@theme inline` and clears Tailwind's default colour, font, radius, shadow, easing and type scales (`--color-*: initial` etc.).
- **Options considered:**
  1. Define tokens directly inside `@theme` and override them per theme.
  2. A separate raw layer plus an `inline` mapping.
- **Why:** With `inline`, utilities compile to `var(--hw-accent)`, so a theme switch is a pure custom-property swap with no duplicated utility CSS. A distinct prefix avoids the circular `--color-bg: var(--color-bg)` problem. Clearing the defaults makes off-brand values (`bg-blue-500`, `rounded-xl`) fail to exist, which enforces the "no magic numbers" rule at build time.
- **Trade-off:** Two names per token (`--hw-accent` ↔ `bg-accent`), documented in DESIGN.md. Breakpoints sit in a normal `@theme` block because media queries can't read runtime variables.

### 006 — Dark theme: attribute override plus OS default, no-flash inline script

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** Light is the default. Dark applies via `:root[data-theme='dark']`, or via `prefers-color-scheme: dark` when `data-theme` isn't `light`. A tiny inline script in `index.html` applies a stored `hallway-theme` choice before first paint. A custom `dark:` variant mirrors the same logic.
- **Options considered:**
  1. Only `prefers-color-scheme`.
  2. Only a class toggled by JS.
  3. Attribute override plus OS fallback.
- **Why:** The site respects the OS by default, still lets users override it (ThemeToggle in Phase 2), and never flashes the wrong theme, even before React loads.
- **Trade-off:** The dark palette is written twice in CSS (once per selector). That's accepted for clarity, and both blocks sit next to each other.

### 007 — Fonts: Fraunces `opsz` + Inter `wght`, metric-matched fallbacks, build-time preload plugin

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** Load `@fontsource-variable/fraunces/opsz.css` (67 kB latin) and `@fontsource-variable/inter/wght.css` (48 kB latin). Add `Fraunces Fallback` (Georgia) and `Inter Fallback` (Arial) `@font-face` rules with `size-adjust`/`ascent-override`/`descent-override`, computed from `@capsizecss/metrics`. A small Vite plugin (`build/preloadFonts.ts`) injects `<link rel="preload">` for the two latin files.
- **Options considered:**
  1. Fraunces `full` (121 kB) for the SOFT and WONK axes.
  2. Fraunces `wght` only (37 kB).
  3. Fraunces `opsz` (67 kB).
  4. Hard-code font URLs in `public/` for easy preloading.
- **Why:** The optical-size axis is what makes Fraunces look right at 120 px _and_ at 22 px, which matters for an editorial site. Full is about 2× heavier for decorative axes. Preloading content-hashed assets needs build-time knowledge of the file name, hence the plugin. Fallback metrics prevent CLS on font swap. The Inter values match the published Next.js values, which validates the method.
- **Trade-off:** About 115 kB of critical-path font. Non-latin subsets are emitted but only downloaded via `unicode-range` if those characters appear.

### 008 — Strictest practical TypeScript and lint settings

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax`. ESLint uses `strictTypeChecked` + `stylisticTypeChecked` + `jsx-a11y` strict, with `--max-warnings 0`.
- **Options considered:**
  1. `strict` only, with recommended lint presets.
  2. Strictest settings.
- **Why:** Portfolio code is read by reviewers. These flags catch real bugs (unchecked array access, `undefined` passed to optional props) and a11y slips at author time.
- **Trade-off:** More friction with third-party types (for example, React Router's `lazy` type needed `NonNullable<>` under `exactOptionalPropertyTypes`).

### 009 — Focus moves to the page h1 on client navigation

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** `RouteFocus` focuses the new page's `h1` (adding `tabindex="-1"`) after every client-side navigation, but not on first load. It falls back to `<main>`.
- **Options considered:**
  1. Focus `<main>`.
  2. Focus the `h1`.
  3. A live-region announcer only.
- **Why:** Focusing the `h1` both announces the new page title to screen readers and puts keyboard users at the start of the content. It is the pattern the brief asks for. Phase 4 will sequence this after the curtain animation finishes.
- **Trade-off:** Requires every route to render exactly one `h1`, which a test enforces.

### 010 — `VITE_SITE_URL` warns rather than fails when missing in production

- **Date:** 2026-11-13
- **Phase:** 1
- **Decision:** `src/lib/env.ts` validates the URL (absolute, http/https, trailing slash stripped) and throws on malformed values. If the variable is missing it falls back to localhost with a console warning.
- **Options considered:**
  1. Fail the build when missing.
  2. Warn and fall back.
- **Why:** Hosting is configured outside the repo, so a forgotten variable in a preview deploy shouldn't break the site. Only canonical and OG URLs degrade. Malformed values still fail loudly.
- **Trade-off:** A misconfigured production build could ship localhost canonicals. The README lists the variable as required in production.

### 011 — Build-time prerendering of every route (SSG) + hydration

- **Date:** 2026-11-13
- **Phase:** 4 (pulled forward from 6)
- **Decision:** After the client build, a second Vite SSR build renders each route with `createStaticHandler` + `StaticRouterProvider` into `dist/<route>/index.html` (+ `404.html`), with per-route `<head>` from react-helmet-async. The client resolves the matched lazy route modules, then hydrates.
- **Options considered:**
  1. Plain SPA (empty `#root` until JS runs).
  2. Framework migration (React Router framework mode / Next).
  3. A ~60-line prerender script on top of the existing data router.
- **Why:** A blank SPA can't hit LCP < 2.5s on simulated mobile, and crawlers see no content. Option 3 keeps the fixed stack and the "static host" deploy target. Measured LCP is ~0.8–1.0s on mobile Lighthouse.
- **Trade-off:** Every component must render identically on the server: no `window` access during render, media/theme hooks use `useSyncExternalStore` with server snapshots, portals mount after hydration. A `data-prerendered` guard makes the client render fresh (instead of hydrating mismatched HTML) if a host serves the wrong file.

### 012 — The first-load intro never hides painted content

- **Date:** 2026-11-13
- **Phase:** 4
- **Decision:** Entrance animations that start from a hidden state only run while something covers the page: the first-visit preloader or the route curtain (`isCovered()`). On a repeat hard-load, the hero simply appears.
- **Options considered:**
  1. Hide hero text with CSS until JS animates it in.
  2. Hide it after hydration and animate it in.
  3. Only animate when the page is covered.
- **Why:** Option 1 makes LCP wait for JavaScript; option 2 flashes text that is already visible. Option 3 gets the masked reveal with no LCP cost and no flash.
- **Trade-off:** Repeat visitors in the same session don't see the headline reveal (they still get every scroll interaction).

### 013 — The preloader is driven by the inline head script, not React

- **Date:** 2026-11-13
- **Phase:** 4 (revised in 6)
- **Decision:** The `<head>` script adds `html.is-preloading` on a first, motion-allowed home visit and lifts it on a fixed 850/1150 ms timeline. The preloader itself is static markup animated by CSS keyframes.
- **Options considered:**
  1. GSAP timeline started after hydration.
  2. CSS + inline-script timeline.
- **Why:** With (1) the preloader's length depended on JS download/parse time, so on a slow phone it could sit there for seconds, the opposite of the brief's "< 1.2s". (2) is deterministic and also lets GSAP leave the entry bundle.
- **Trade-off:** Two places hold the timing numbers (`index.html` and `src/lib/intro.ts`); both are commented to stay in sync.

### 014 — GSAP, Lenis and Framer Motion's engine are lazy chunks

- **Date:** 2026-11-13
- **Phase:** 6
- **Decision:** `lib/gsap.ts` exposes `loadGsap()` / `withGsap()` and only `import type`s GSAP. `useGsapContext` passes `gsap` and `ScrollTrigger` into each setup. Lenis is imported dynamically. Framer Motion uses `LazyMotion` + `m` components with `domAnimation` loaded on demand.
- **Options considered:**
  1. Static imports (entry chunk measured 205.6 kB gz).
  2. Lazy-load the motion stack.
- **Why:** The entry chunk dropped to 120.8 kB gz (budget 170 kB). Nothing above the fold needs these libraries to paint: the arch's start shape is CSS, and the intro waits for the preloader anyway.
- **Trade-off:** Motion starts a few hundred ms after hydration on a cold load; layout and content never depend on it.

### 015 — Motion setups run one per task, and below-the-fold ones wait until near the viewport

- **Date:** 2026-11-14
- **Phase:** 6
- **Decision:** `useGsapContext` schedules each setup in its own macrotask (`lib/scheduler.ts`, MessageChannel) and, unless `{ eager: true }`, waits for an IntersectionObserver (`rootMargin: 100%`) before running. Hydration runs inside `startTransition` so React time-slices it.
- **Options considered:**
  1. Run all setups synchronously in layout effects.
  2. Defer to `requestIdleCallback`.
  3. Yield between setups and defer off-screen ones.
- **Why:** On the home page, the ~25 setups (each creating ScrollTriggers, which measure layout) plus hydration formed long tasks. Total Blocking Time measured 2,066 ms. After these changes home measured 86 ms. `requestIdleCallback` isn't in Safari.
- **Trade-off:** Eager is required for the hero (intro under the preloader), page heroes (under the curtain) and the pinned section (its spacer changes positions every later trigger measures).

### 016 — Accessibility details that shaped components

- **Date:** 2026-11-13
- **Phase:** 2–6
- **Decision:**
  - UI mocks (inbox, story, vignettes) are `role="img"` with a written description, or `aria-hidden` when a heading already says the same, so sample chat text isn't read as page content.
  - Counters render the final number in an sr-only span; animated digits are `aria-hidden`.
  - The marquee has an explicit Pause button (WCAG 2.2.2), not only hover-pause.
  - Pricing uses native radios in a fieldset; the comparison is a real `<table>` with `scope`d headers on desktop and the same data as stacked description lists on mobile.
  - Inactive story steps are dimmed to 60% opacity (4.49:1 light / 6.12:1 dark on large text). 40% failed axe.
- **Why:** Found or confirmed by axe (0 violations on all routes in both themes) and keyboard e2e tests.
- **Trade-off:** None worth noting; each is plain HTML semantics.

### 017 — Dark tokens are defined twice, and must stay identical

- **Date:** 2026-11-13
- **Phase:** 6
- **Decision:** Keep the explicit `[data-theme='dark']` block and the `prefers-color-scheme` block (DECISIONS 006), but treat drift between them as a bug.
- **Why:** An axe run caught `--hw-danger`, `--hw-success` and `--hw-accent-hover` missing from the media block only. OS-dark users got light-theme red on a dark card (contrast fail), while users who picked dark were fine. The e2e axe suite now emulates OS dark specifically, which covers this path.
- **Trade-off:** Duplication remains; a future step could generate both blocks from one list.

### 018 — Visual baselines are per-OS

- **Date:** 2026-11-14
- **Phase:** 7
- **Decision:** Snapshots live under `tests/e2e/__screenshots__/{platform}/`, and the config uses `updateSnapshots: 'missing'`. Windows baselines are committed. CI (Linux) creates its baselines on the first run and uploads them as an artifact to commit.
- **Why:** Font rasterisation differs between OSes. Comparing Windows baselines on Linux would always fail, and generating Linux baselines needs Linux.
- **Trade-off:** Until the Linux baselines are committed, CI's visual job records rather than compares.

### 019 — Hydrate synchronously; split work with Suspense boundaries instead of startTransition

- **Date:** 2026-11-14
- **Phase:** 6
- **Decision:** `hydrateRoot` runs synchronously. Long pages are split with `HydrationBoundary` (`<Suspense fallback={null}>`) around each section, around the hero's static inbox mock and logo marquee, and around the footer.
- **Options considered:**
  1. One synchronous hydration (Home: a 280–460 ms task under mobile throttling).
  2. `startTransition(() => hydrateRoot(...))`.
  3. Selective hydration via Suspense boundaries.
- **Why:** (2) lowered TBT, but an e2e test showed a tap on "Open menu" during hydration was silently lost: the browser dispatched it between time slices, before React had attached handlers. (3) hydrates the shell first and each boundary in its own task. A discrete event inside an unhydrated boundary makes React hydrate it immediately and replay the event.
- **Trade-off:** Below-the-fold sections become interactive a few hundred ms after the shell. The e2e test for the demo tabs reaches them the way a user does (scroll first) rather than pressing keys on load.

### 020 — `content-visibility: auto` below the pin, but not on the FAQ

- **Date:** 2026-11-14
- **Phase:** 6
- **Decision:** A `defer-render` utility (`content-visibility: auto; contain-intrinsic-size: auto 56rem`) on Demo, Metrics, Testimonials, Integrations and the footer.
- **Options considered:**
  1. None (Home mobile median Performance 0.82–0.87 in back-to-back runs).
  2. Every below-fold section.
  3. Only sections after the pinned "How it works", excluding the FAQ.
- **Why:**
  - Content above the pin must keep real heights, because the pin's scroll distance is measured from them.
  - The FAQ was excluded after Lighthouse reported a false contrast failure: while skipped, its text has no layout boxes, so axe sampled the accent CTA panel underneath. The other deferred sections pass axe.
  - Chrome's full-page capture doesn't paint skipped sections, so the visual test forces `content-visibility: visible` (users see them render as they near the viewport). Print styles do the same.
- **Trade-off:** A mild coupling between section order and this optimisation, documented in the utility's comment. Trying `max-lg:` deferral for the sections above the pin made results worse and was reverted.

### 021 — Honest budgets: median-run aggregation; TBT is a warning; INP measured directly

- **Date:** 2026-11-14
- **Phase:** 7
- **Decision:** Lighthouse CI asserts on the **median** run (`aggregationMethod: 'median-run'`) rather than LHCI's default optimistic best-of-N. Performance ≥ 0.90, A11y/BP/SEO = 1, LCP ≤ 2.5 s and CLS ≤ 0.05 are errors. TBT ≤ 300 ms is a warning. Interaction latency is measured with the Event Timing API under 4× CPU throttling (`pnpm perf`), with a worst case of 184 ms.
- **Why:** TBT is a load-time lab metric, not INP, and the brief's bar is INP < 200 ms. Laptop measurements of mobile Performance varied by ±0.06 between identical runs, so medians are the only defensible number. Home's median is 0.91 (runs 0.88–0.94); the other pages are 0.96–0.97; desktop is 100 everywhere.
- **Trade-off:** Home sits close to the 0.90 line, so a slow CI runner could fail it. If that happens, the next levers are a lighter display font file (`wght` instead of `opsz`, −30 kB) and moving the inbox mock's chat thread out of the initial DOM.
