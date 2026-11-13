/**
 * JS mirror of the motion tokens in src/styles/tokens.css, for GSAP and Framer Motion.
 * Keep in sync with DESIGN.md. Durations are in seconds (the unit both libraries use).
 */

export const duration = {
  instant: 0.1,
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  slower: 0.9,
  curtain: 0.75,
} as const;

export const stagger = 0.06;

/** Cubic-bezier control points, usable by Framer Motion (`ease: easing.outExpo`). */
export const easing = {
  standard: [0.2, 0, 0, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  emphasized: [0.3, 0, 0, 1.15],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type EasingName = keyof typeof easing;

/** CSS string form, e.g. for GSAP's CustomEase or inline styles. */
export function cubicBezier(name: EasingName): string {
  return `cubic-bezier(${easing[name].join(', ')})`;
}
