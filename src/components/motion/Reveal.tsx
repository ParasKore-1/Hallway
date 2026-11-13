import type { ReactNode } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { hasPassedRevealLine } from '@/lib/gsap';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: boolean;
  /** Vertical travel in px (full motion). */
  distance?: number;
}

/**
 * Fade-and-rise on scroll into view, once. Content is fully present in the HTML; the hidden
 * start state is applied by GSAP only after hydration and only while off-screen.
 * Reduced motion: a short opacity fade with no travel.
 */
export function Reveal({ children, className, stagger = false, distance = 32 }: RevealProps) {
  const ref = useGsapContext(({ scope, reduced, gsap }) => {
    if (hasPassedRevealLine(scope)) return;
    const targets = stagger ? Array.from(scope.children) : [scope];
    gsap.from(targets, {
      y: reduced ? 0 : distance,
      opacity: 0,
      duration: reduced ? 0.2 : 0.9,
      stagger: stagger ? 0.08 : 0,
      ease: 'expo.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: scope, start: 'top 88%', once: true },
    });
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
