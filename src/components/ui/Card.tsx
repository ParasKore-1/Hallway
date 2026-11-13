import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** surface = white card, muted = surface-2, outline = transparent with border. */
  variant?: 'surface' | 'muted' | 'outline';
  /** Adds hover elevation; use when the card contains a stretched link. */
  interactive?: boolean;
  padding?: 'none' | 'md' | 'lg';
}

const variants = {
  surface: 'bg-surface shadow-sm',
  muted: 'bg-surface-2',
  outline: 'border border-line bg-transparent',
} as const;

const paddings = { none: '', md: 'p-6', lg: 'p-8 md:p-10' } as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'surface', interactive = false, padding = 'md', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        '@container relative rounded-lg',
        variants[variant],
        paddings[padding],
        interactive &&
          'transition-transform duration-(--hw-dur-base) ease-out-expo focus-within:-translate-y-1 hover:-translate-y-1',
        className,
      )}
      {...props}
    />
  );
});
