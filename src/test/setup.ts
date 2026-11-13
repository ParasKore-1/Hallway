import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Lazy route modules are transformed on first import in tests; give async queries headroom.
configure({ asyncUtilTimeout: 8000 });

// Tests assert behaviour, not animation: skip motion/react transitions entirely.
MotionGlobalConfig.skipAnimations = true;

// jsdom lacks matchMedia. Report "reduced motion" so GSAP setups take their short path.
const matchMedia = (query: string): MediaQueryList =>
  ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    // Deprecated members still exist on the real interface.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    addListener: () => undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }) satisfies MediaQueryList;
window.matchMedia = matchMedia;

class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe(): void {
    // jsdom has no layout, so nothing ever intersects.
  }
  unobserve(): void {
    // no-op
  }
  disconnect(): void {
    // no-op
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
window.IntersectionObserver = NoopIntersectionObserver;

beforeEach(() => {
  // jsdom does not implement scrolling; route transitions call it on navigation.
  // Re-applied per test because `restoreMocks` restores spies after each one.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
});
