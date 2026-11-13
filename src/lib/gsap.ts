import type { gsap as GsapNamespace } from 'gsap';
import type { ScrollTrigger as ScrollTriggerClass } from 'gsap/ScrollTrigger';

export type Gsap = typeof GsapNamespace;
export type ScrollTriggerStatic = typeof ScrollTriggerClass;

export interface GsapModules {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerStatic;
}

/**
 * GSAP + ScrollTrigger are loaded on demand (a separate chunk fetched right after hydration)
 * instead of sitting in the entry bundle: nothing above the fold needs them to paint — the
 * hero arch's start state is CSS and the intro waits for the preloader anyway.
 */
let modules: GsapModules | null = null;
let pending: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  pending ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, scroll]) => {
    core.gsap.registerPlugin(scroll.ScrollTrigger);
    core.gsap.defaults({ ease: 'expo.out', duration: 0.6 });
    scroll.ScrollTrigger.config({ ignoreMobileResize: true });
    modules = { gsap: core.gsap, ScrollTrigger: scroll.ScrollTrigger };
    return modules;
  });
  return pending;
}

/** The modules if already loaded (lets later pages set up synchronously, under the curtain). */
export function getGsap(): GsapModules | null {
  return modules;
}

/** Run `callback` with GSAP now if loaded, else when it arrives. Returns a canceller. */
export function withGsap(callback: (modules: GsapModules) => void): () => void {
  if (modules) {
    callback(modules);
    return () => undefined;
  }
  let cancelled = false;
  void loadGsap().then((loaded) => {
    if (!cancelled) callback(loaded);
  });
  return () => {
    cancelled = true;
  };
}

/** Media conditions shared by every motion setup (see useGsapContext). */
export const motionQueries = {
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 64rem)',
  finePointer: '(pointer: fine)',
} as const;

/** GSAP equivalents of the CSS easing tokens. */
export const gsapEase = {
  standard: 'power2.out',
  outExpo: 'expo.out',
  inOutQuart: 'power4.inOut',
  emphasized: 'back.out(1.4)',
} as const;

/**
 * True if `el` has already reached a reveal line at `ratio` of the viewport height (or is
 * above the viewport). Lazily-created reveals must not hide such elements: a play-once trigger
 * created after its start has passed never fires, which would leave the content invisible.
 */
export function hasPassedRevealLine(el: Element, ratio = 0.88): boolean {
  return el.getBoundingClientRect().top < window.innerHeight * ratio;
}

/** Matches the `desktop` motion condition. False on the server. */
export function isDesktopViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(motionQueries.desktop).matches;
}
