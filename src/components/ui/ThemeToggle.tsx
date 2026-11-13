import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Switches between light and dark. Before hydration the theme is unknown to React, so the
 * button renders a neutral state (both icons cross-faded by CSS would flash; we just wait).
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
      }}
      aria-label={theme ? `Switch to ${next} theme` : 'Toggle colour theme'}
      className={cn(
        'grid size-11 place-items-center rounded-pill text-ink transition-colors duration-(--hw-dur-fast) hover:bg-surface-2',
        className,
      )}
    >
      <Icon
        name={theme === 'dark' ? 'sun' : 'moon'}
        className={cn('transition-opacity', theme === null && 'opacity-0')}
      />
    </button>
  );
}
