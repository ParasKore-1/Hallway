import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export type TagProps = ComponentPropsWithoutRef<'span'>;

/** Outlined topic label (e.g. "Viewings", "HMO"). Non-interactive. */
export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xs border border-ink-muted px-2 py-0.5 font-mono text-xs text-ink-muted',
        className,
      )}
      {...props}
    />
  );
}
