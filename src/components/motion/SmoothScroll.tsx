import type Lenis from 'lenis';
import { useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { loadGsap } from '@/lib/gsap';
import { isScrollLocked, onScrollLockChange } from '@/lib/scrollLock';
import { LenisContext } from './lenisContext';

export interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so there is exactly one RAF loop for
 * Lenis + ScrollTrigger + all tweens. ScrollTrigger updates on every Lenis scroll event.
 * Off entirely for reduced-motion users; paused whenever a modal/drawer locks scroll.
 * Created lazily on the first wheel event (see below).
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;
    // Lenis only smooths wheel scrolling (touch stays native), so it is created on the first
    // wheel event rather than at load: phones never pay for it, and its <html> class changes
    // (a whole-document style recalc) stay out of page load. The first wheel tick is native.
    const start = () => {
      window.removeEventListener('wheel', start);
      void init();
    };
    window.addEventListener('wheel', start, { passive: true });
    const init = () =>
      Promise.all([import('lenis'), loadGsap()]).then(
        ([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
          if (cancelled) return;
          const instance = new LenisClass({ autoRaf: false, lerp: 0.12, anchors: { offset: -96 } });
          const tick = (time: number) => {
            instance.raf(time * 1000);
          };
          instance.on('scroll', () => {
            ScrollTrigger.update();
          });
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
          if (isScrollLocked()) instance.stop();
          const unsubscribe = onScrollLockChange((locked) => {
            if (locked) instance.stop();
            else instance.start();
          });
          setLenis(instance);
          teardown = () => {
            unsubscribe();
            gsap.ticker.remove(tick);
            instance.destroy();
          };
        },
      );
    return () => {
      cancelled = true;
      window.removeEventListener('wheel', start);
      teardown?.();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
