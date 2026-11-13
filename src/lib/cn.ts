import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge must know our custom token names, otherwise it treats e.g. `text-display`
 * (a font size) and `text-ink` (a colour) as the same group and drops one of them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'bg',
        'surface',
        'surface-2',
        'ink',
        'ink-muted',
        'line',
        'accent',
        'accent-hover',
        'on-accent',
        'brass',
        'brass-soft',
        'focus',
        'danger',
        'success',
      ],
      text: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', 'display', 'metric'],
      font: ['display', 'sans', 'mono'],
      radius: ['xs', 'sm', 'md', 'lg', 'pill', 'arch'],
      shadow: ['xs', 'sm', 'md', 'lg', 'focus'],
      ease: ['standard', 'out-expo', 'in-out-quart', 'emphasized'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
