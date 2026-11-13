import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeTheme, type Theme } from '@/lib/theme';

export interface UseThemeResult {
  /** Resolved theme, or null before hydration (server doesn't know the user's theme). */
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}

export function useTheme(): UseThemeResult {
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, () => null);
  return { theme, setTheme };
}
