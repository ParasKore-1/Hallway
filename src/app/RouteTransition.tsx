import { AnimatePresence, m, type Variants } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { NavigationType, useLocation, useNavigationType, useOutlet } from 'react-router';
import { useLenis } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getGsap } from '@/lib/gsap';
import { markClientNavigation } from '@/lib/intro';
import { easing } from '@/lib/motion';

export interface RouteTransitionProps {
  mainId: string;
}

/** Scroll positions per history entry, for back/forward restoration. */
const savedPositions = new Map<string, number>();

const curtainVariants: Variants = {
  // Mounting page: start covered, then lift away upwards.
  enter: { y: '0%' },
  idle: { y: '-102%', transition: { duration: 0.6, ease: easing.inOutQuart, delay: 0.05 } },
  // Leaving page: rise from below to cover.
  leave: { y: ['102%', '0%'], transition: { duration: 0.5, ease: easing.inOutQuart } },
};

const pageVariants: Variants = {
  enter: {},
  idle: {},
  // Parent waits for the curtain (child) to finish covering before unmounting.
  leave: { transition: { when: 'afterChildren' } },
};

const reducedPageVariants: Variants = {
  enter: { opacity: 0 },
  idle: { opacity: 1, transition: { duration: 0.15 } },
  leave: { opacity: 0, transition: { duration: 0.15 } },
};

/**
 * Route transitions: an arched curtain wipes up over the old page, the route swaps
 * underneath (scroll restored or reset while covered), then the curtain lifts away.
 * AnimatePresence + a keyed useOutlet() element keeps the old route rendered while it exits.
 * Focus then moves to the new page's h1. Reduced motion: a 150ms crossfade, no curtain.
 */
export function RouteTransition({ mainId }: RouteTransitionProps) {
  const location = useLocation();
  const outlet = useOutlet();
  const navigationType = useNavigationType();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const isFirst = useRef(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  // Remember where we were on the page we're leaving.
  useEffect(() => {
    const key = location.key;
    return () => {
      savedPositions.set(key, window.scrollY);
      // A navigation is starting: the next page mounts under the curtain.
      markClientNavigation();
    };
  }, [location.key]);

  const restoreScroll = () => {
    const saved =
      navigationType === NavigationType.Pop ? savedPositions.get(location.key) : undefined;
    const hashTarget = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    const top =
      saved ?? (hashTarget ? hashTarget.getBoundingClientRect().top + window.scrollY - 96 : 0);
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: 'instant' });
  };

  const onEntered = () => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const main = document.getElementById(mainId);
    const heading = main?.querySelector<HTMLHeadingElement>('h1');
    const target = heading ?? main;
    if (heading && !heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        restoreScroll();
        requestAnimationFrame(() => {
          getGsap()?.ScrollTrigger.refresh();
        });
      }}
    >
      <m.div
        key={location.pathname}
        initial="enter"
        animate="idle"
        exit="leave"
        variants={reduced ? reducedPageVariants : pageVariants}
      >
        <PageMount onMount={onEntered}>{outlet}</PageMount>
        {!reduced && (
          <m.div
            aria-hidden="true"
            variants={curtainVariants}
            className="pointer-events-none fixed inset-x-0 -top-[10vh] z-(--hw-z-curtain) grid h-[120vh] place-items-center rounded-t-[50vw] bg-accent text-on-accent"
          >
            <svg viewBox="0 0 24 28" className="h-12 w-auto opacity-90">
              <path d="M2 27V12a10 10 0 0 1 20 0v15z" fill="currentColor" />
            </svg>
          </m.div>
        )}
      </m.div>
    </AnimatePresence>
  );
}

interface PageMountProps {
  onMount: () => void;
  children: ReactNode;
}

/** Fires `onMount` once the (new) page has committed — after the old one has fully exited. */
function PageMount({ onMount, children }: PageMountProps) {
  const onMountRef = useRef(onMount);
  useEffect(() => {
    onMountRef.current();
  }, []);
  return <>{children}</>;
}
