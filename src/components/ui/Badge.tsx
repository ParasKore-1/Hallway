import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  tone?: 'neutral' | 'accent' | 'brass' | 'success' | 'danger';
  /** Leading status dot. */
  dot?: boolean;
}

const tones = {
  neutral: 'bg-surface-2 text-ink',
  accent: 'bg-accent text-on-accent',
  brass: 'bg-brass-soft/40 text-ink',
  success: 'bg-surface-2 text-success',
  danger: 'bg-surface-2 text-danger',
} as const;

/** Small, non-interactive status label. */
export function Badge({
  tone = 'neutral',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-pill bg-current" />}
      {children}
    </span>
  );
}
