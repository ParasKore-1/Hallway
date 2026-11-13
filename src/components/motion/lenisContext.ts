import type Lenis from 'lenis';
import { createContext } from 'react';

/** The active Lenis instance, or null when smooth scrolling is off (reduced motion, SSR). */
export const LenisContext = createContext<Lenis | null>(null);
