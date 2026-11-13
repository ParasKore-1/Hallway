import { Suspense, type ReactNode } from 'react';

export interface HydrationBoundaryProps {
  children: ReactNode;
}

/**
 * A Suspense boundary used purely to split hydration (nothing inside actually suspends).
 * React 18 hydrates the page shell first, then each boundary in its own task, yielding to
 * the browser in between, so a long page doesn't hydrate as one long task. A click inside a
 * boundary that isn't hydrated yet makes React hydrate it at once and replay the event,
 * so early taps are never lost (unlike hydrating the whole root inside startTransition).
 * The fallback never renders: the prerendered HTML is already there.
 */
export function HydrationBoundary({ children }: HydrationBoundaryProps) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
