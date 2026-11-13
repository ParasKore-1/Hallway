import { useRef, type RefObject } from 'react';
import { motionQueries, withGsap, type Gsap, type ScrollTriggerStatic } from '@/lib/gsap';
import { runInOwnTask } from '@/lib/scheduler';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface MotionConditions<T extends HTMLElement> {
  scope: T;
  reduced: boolean;
  desktop: boolean;
  finePointer: boolean;
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerStatic;
}

export type MotionSetup<T extends HTMLElement> = (conditions: MotionConditions<T>) => unknown;

/**
 * Scoped GSAP setup for a component.
 *
 * Uses gsap.matchMedia(scope) — a gsap.context under the hood — so:
 * - selector strings resolve inside `scope` only;
 * - every tween and ScrollTrigger created in `setup` is reverted on unmount;
 * - when reduced-motion / breakpoint / pointer conditions change, everything is reverted and
 *   `setup` re-runs with the new conditions (e.g. pinned scroll only ≥1024px).
 *
 * GSAP is lazy-loaded; `setup` receives it as an argument and runs as soon as it is available
 * (synchronously once loaded). A setup may return a cleanup function.
 */
export interface GsapContextOptions {
  /**
   * Run setup immediately instead of waiting until the element is within one viewport of the
   * screen. Use for above-the-fold intros and for anything that changes page height (pins),
   * since later triggers measure positions after it.
   */
  eager?: boolean;
}

export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: MotionSetup<T>,
  { eager = false }: GsapContextOptions = {},
): RefObject<T> {
  const scopeRef = useRef<T>(null);
  const setupRef = useRef(setup);

  useIsomorphicLayoutEffect(() => {
    setupRef.current = setup;
  });

  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    let revert: (() => void) | undefined;
    let cancelTask: () => void = () => undefined;
    let cancelLoad: () => void = () => undefined;
    const start = () => {
      cancelLoad = withGsap(({ gsap, ScrollTrigger }) => {
        // One setup per task: keeps long tasks (and TBT) down on motion-heavy pages.
        cancelTask = runInOwnTask(() => {
          const mm = gsap.matchMedia(scope);
          mm.add(motionQueries, (context) => {
            const {
              reduced = false,
              desktop = false,
              finePointer = false,
            } = context.conditions ?? {};
            const cleanup = setupRef.current({
              scope,
              reduced,
              desktop,
              finePointer,
              gsap,
              ScrollTrigger,
            });
            return typeof cleanup === 'function' ? (cleanup as () => void) : undefined;
          });
          revert = () => {
            mm.revert();
          };
        });
      });
    };

    // Below-the-fold setups wait until they are about a viewport away: nothing visible
    // changes (their hidden start states are applied while still off-screen) and page load
    // does far less main-thread work.
    let observer: IntersectionObserver | undefined;
    if (eager || typeof IntersectionObserver === 'undefined') {
      start();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            start();
          }
        },
        { rootMargin: '100% 0px' },
      );
      observer.observe(scope);
    }
    return () => {
      observer?.disconnect();
      cancelLoad();
      cancelTask();
      revert?.();
    };
  }, []);

  return scopeRef;
}
