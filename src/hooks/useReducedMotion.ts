import { useMediaQuery } from './useMediaQuery';

/** True when the user asked the OS to reduce motion. False during SSR. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
