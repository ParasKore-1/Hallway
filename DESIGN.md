# DESIGN.md — Hallway

## Visual concept: "The Threshold"

A hallway is the space between the street and the home — where tenants arrive, wait, ask
questions. Hallway (the product) is that calm in-between layer for letting agents: every
enquiry passes through it and comes out handled.

The site borrows from **editorial print and architecture**, not tech-startup gradients:

- Warm paper backgrounds, near-black ink, a single deep "front-door green" accent and a
  restrained brass highlight (think door furniture).
- Large serif display type with tight leading; a quiet grotesk for body and UI.
- Generous whitespace, hairline rules, a visible 12-column grid in places (like a floor plan).
- A recurring **arched doorway shape** (rectangle with a semicircular top) used as image masks,
  card tops, the 404 illustration and the route-transition curtain.
- Motion is soft and weighted: things _settle_, they don't bounce.

## Signature interaction — "Step through the door"

1. **Hero:** the product dashboard mock sits inside an arched doorway mask. As the user scrolls
   the first ~80vh, the arch scales open (`clip-path` inset/ellipse interpolation driven by
   ScrollTrigger scrub) until the mock fills the viewport edge-to-edge — you've "walked in".
   Live chat bubbles inside the mock (tenant ↔ Hallway AI) type out as it opens.
2. **Route transitions** reuse the same arch: a paper-coloured curtain rises in an arch shape,
   the route swaps underneath, and it lifts away — consistent spatial metaphor across pages.
3. **Reduced motion:** the hero shows the mock fully open inside a static arch frame; route
   changes crossfade in 150 ms. Nothing is lost, only the travel.

Supporting moments: masked line-by-line headline reveal, cursor-following spotlight on bento
cards, pinned horizontal "How it works" corridor (four "rooms" on desktop), counters in the
metrics band, kinetic type on the closing CTA ("Every enquiry, answered.").

## Colour

Tokens are semantic; components never reference raw hex. In code, raw tokens are `--hw-*` (e.g. `--hw-accent`) in `src/styles/tokens.css`; Tailwind exposes them as `--color-*` utilities (`bg-accent`). Exact `clamp()` values live in tokens.css.

### Light (default when `prefers-color-scheme: light`)

| Token                  | Hex       | Use                                             |
| ---------------------- | --------- | ----------------------------------------------- |
| `--color-bg`           | `#F6F2EB` | Page background (paper)                         |
| `--color-surface`      | `#FFFFFF` | Cards, mock UI panels                           |
| `--color-surface-2`    | `#ECE6DC` | Alternate bands, input backgrounds              |
| `--color-ink`          | `#16181D` | Primary text                                    |
| `--color-ink-muted`    | `#4F535C` | Secondary text, captions; form-control borders  |
| `--color-line`         | `#B3ACA1` | Decorative hairlines only (non-essential)       |
| `--color-accent`       | `#1E4A41` | Primary buttons, links, highlighted word        |
| `--color-on-accent`    | `#FFFFFF` | Text on accent                                  |
| `--color-brass`        | `#8A5A1C` | Small text highlights, eyebrow labels           |
| `--color-brass-soft`   | `#E3B66B` | Decorative fills, highlight-marker behind words |
| `--color-focus`        | `#2456E6` | Focus ring                                      |
| `--color-accent-hover` | `#163A33` | Primary button hover (12.45:1 with white)       |
| `--color-danger`       | `#A3271F` | Urgent / error text (6.56:1 on bg)              |
| `--color-success`      | `#1E6B3A` | Resolved / success text (5.85:1 on bg)          |

### Dark (`[data-theme="dark"]`, or `prefers-color-scheme: dark` when no explicit theme)

| Token                  | Hex       | Use                                           |
| ---------------------- | --------- | --------------------------------------------- |
| `--color-bg`           | `#0E1012` | Page background                               |
| `--color-surface`      | `#171A1D` | Cards                                         |
| `--color-surface-2`    | `#1F2327` | Alternate bands, inputs                       |
| `--color-ink`          | `#ECE8E1` | Primary text                                  |
| `--color-ink-muted`    | `#A2A6AD` | Secondary text; form-control borders          |
| `--color-line`         | `#4A5057` | Decorative hairlines only                     |
| `--color-accent`       | `#8CCBB5` | Primary buttons, links, highlighted word      |
| `--color-on-accent`    | `#0E1012` | Text on accent                                |
| `--color-brass`        | `#E3B66B` | Eyebrows, small highlights                    |
| `--color-brass-soft`   | `#5A4423` | Decorative fills                              |
| `--color-focus`        | `#7FA6FF` | Focus ring                                    |
| `--color-accent-hover` | `#A6D9C7` | Primary button hover (12.14:1 with on-accent) |
| `--color-danger`       | `#FF9389` | Urgent / error text (8.88:1 on bg)            |
| `--color-success`      | `#86D6A0` | Resolved / success text (11.02:1 on bg)       |

### Contrast (WCAG 2.x, computed)

| Pair                                        | Light | Dark  | Requirement                                                                                                |
| ------------------------------------------- | ----- | ----- | ---------------------------------------------------------------------------------------------------------- |
| ink on bg                                   | 15.91 | 15.61 | AA 4.5 ✔ (AAA)                                                                                             |
| ink on surface                              | 17.76 | 14.31 | ✔                                                                                                          |
| ink on surface-2                            | 14.31 | 12.95 | ✔                                                                                                          |
| ink-muted on bg                             | 6.91  | 7.80  | ✔                                                                                                          |
| ink-muted on surface-2                      | 6.21  | 6.47  | ✔                                                                                                          |
| on-accent on accent (buttons)               | 9.95  | 10.28 | ✔                                                                                                          |
| accent on bg (links)                        | 8.91  | 10.28 | ✔                                                                                                          |
| brass on bg (eyebrows)                      | 5.29  | 10.14 | ✔                                                                                                          |
| ink on brass-soft (marker highlight, light) | 9.45  | —     | ✔                                                                                                          |
| focus ring vs bg                            | 5.30  | 7.99  | UI 3:1 ✔                                                                                                   |
| line on bg                                  | 2.02  | 2.34  | **decorative only** — never the sole boundary of an interactive control (controls use `ink-muted` borders) |

## Typography

- **Display:** Fraunces Variable (`@fontsource-variable/fraunces`) — editorial serif; its
  optical-size (`opsz`) axis tunes stroke contrast for headline vs. small sizes. Weight 350–500. Preloaded (latin subset, woff2).
- **Text/UI:** Inter Variable (`@fontsource-variable/inter`) — weight 400–600, `font-feature-settings: "ss01","cv11"`, tabular nums for metrics/prices.
- Metric-matched fallbacks (`size-adjust`, `ascent-override`) on Georgia / Arial to avoid CLS.
- Headings: `text-wrap: balance`; body: `text-wrap: pretty`, max 68ch.
- Curly quotes and proper apostrophes in all copy (’ “ ” —).

### Fluid type scale (min @ 320px → max @ 1440px)

| Token            | Size                                          | Line-height | Tracking | Use                  |
| ---------------- | --------------------------------------------- | ----------- | -------- | -------------------- |
| `--text-xs`      | `clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)`  | 1.4         | 0.02em   | Footnotes, legal     |
| `--text-sm`      | `clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem)` | 1.5         | 0        | UI, captions         |
| `--text-base`    | `clamp(1rem, 0.96rem + 0.18vw, 1.125rem)`     | 1.6         | 0        | Body                 |
| `--text-lg`      | `clamp(1.125rem, 1.05rem + 0.36vw, 1.375rem)` | 1.5         | -0.005em | Lead paragraphs      |
| `--text-xl`      | `clamp(1.375rem, 1.23rem + 0.71vw, 1.875rem)` | 1.3         | -0.01em  | Card titles (h3)     |
| `--text-2xl`     | `clamp(1.75rem, 1.48rem + 1.34vw, 2.75rem)`   | 1.15        | -0.015em | Section titles (h2)  |
| `--text-3xl`     | `clamp(2.25rem, 1.75rem + 2.5vw, 4rem)`       | 1.05        | -0.02em  | Page titles          |
| `--text-display` | `clamp(2.75rem, 1.7rem + 5.2vw, 7.5rem)`      | 0.95        | -0.03em  | Hero headline        |
| `--text-metric`  | `clamp(3rem, 2rem + 5vw, 8rem)`               | 0.9         | -0.04em  | Metrics band numbers |

## Spacing scale (4px base)

`--space-0: 0` · `--space-1: 0.25rem` · `--space-2: 0.5rem` · `--space-3: 0.75rem` ·
`--space-4: 1rem` · `--space-5: 1.25rem` · `--space-6: 1.5rem` · `--space-8: 2rem` ·
`--space-10: 2.5rem` · `--space-12: 3rem` · `--space-16: 4rem` · `--space-20: 5rem` ·
`--space-24: 6rem` · `--space-32: 8rem`

Fluid layout spacing:

- `--gutter: clamp(1rem, 0.6rem + 2vw, 2.5rem)` — page side padding
- `--section-y: clamp(4rem, 2.5rem + 7.5vw, 10rem)` — vertical section rhythm
- `--container-max: 90rem` (1440px), `--container-prose: 68ch`

## Radius

`--radius-xs: 4px` (tags) · `--radius-sm: 8px` (inputs) · `--radius-md: 14px` (buttons, small cards) ·
`--radius-lg: 24px` (cards, mock panels) · `--radius-pill: 999px` · `--radius-arch: 50% 50% var(--radius-lg) var(--radius-lg) / 40% 40% var(--radius-lg) var(--radius-lg)` (signature arch).

## Shadows (soft, warm-tinted; dark theme uses subtler, near-black)

- `--shadow-xs: 0 1px 2px rgb(22 24 29 / 0.06)`
- `--shadow-sm: 0 2px 6px rgb(22 24 29 / 0.06), 0 1px 2px rgb(22 24 29 / 0.04)`
- `--shadow-md: 0 12px 24px -8px rgb(22 24 29 / 0.12), 0 2px 6px rgb(22 24 29 / 0.05)`
- `--shadow-lg: 0 32px 64px -24px rgb(22 24 29 / 0.22), 0 4px 12px rgb(22 24 29 / 0.06)`
- `--shadow-focus: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-focus)`

Shadows are never animated directly; hover elevation animates opacity of a pre-rendered
shadow pseudo-element.

## Motion tokens

| Token                 | Value                            | Use                                      |
| --------------------- | -------------------------------- | ---------------------------------------- |
| `--dur-instant`       | 100ms                            | Pressed states, colour swaps             |
| `--dur-fast`          | 180ms                            | Hover, focus, tooltips                   |
| `--dur-base`          | 320ms                            | Menus, accordions, toasts                |
| `--dur-slow`          | 600ms                            | Section reveals, modal                   |
| `--dur-slower`        | 900ms                            | Hero line reveals                        |
| `--dur-curtain`       | 750ms                            | Route transition (total)                 |
| `--ease-standard`     | `cubic-bezier(0.2, 0, 0, 1)`     | Default UI                               |
| `--ease-out-expo`     | `cubic-bezier(0.16, 1, 0.3, 1)`  | Reveals — fast start, long settle        |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Curtain, pinned transitions              |
| `--ease-emphasized`   | `cubic-bezier(0.3, 0, 0, 1.15)`  | Tiny overshoot for magnetic release only |
| `--stagger`           | 60ms                             | Word/line staggers                       |

Reduced motion: all durations collapse to `--dur-fast` opacity fades; no translation > 8px,
no parallax, no scrub-linked transforms, no auto-playing marquee.

## Breakpoints

`sm 375` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1440` · `3xl 1920`. Verified also at 320.
Container queries (`@container`) for bento cards, pricing cards and testimonial cards.
