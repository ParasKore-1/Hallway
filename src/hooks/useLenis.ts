import type Lenis from 'lenis';
import { useContext } from 'react';
import { LenisContext } from '@/components/motion/lenisContext';

/** Access the smooth-scroll instance (null when native scrolling is in use). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
