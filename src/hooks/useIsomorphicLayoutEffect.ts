import { useEffect, useLayoutEffect } from 'react';

/** useLayoutEffect in the browser (no paint between DOM commit and animation setup), useEffect on the server. */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
