import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface TextProps extends ComponentPropsWithoutRef<'p'> {
  as?: 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg';
  tone?: 'default' | 'muted' | 'accent';
  /** Constrain to the 68ch reading measure. */
  measure?: boolean;
}

const sizes = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg' } as const;
const tones = { default: 'text-ink', muted: 'text-ink-muted', accent: 'text-accent' } as const;

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { as: Tag = 'p', size = 'base', tone = 'default', measure = false, className, ...props },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn(sizes[size], tones[tone], measure && 'max-w-prose', 'text-pretty', className)}
      {...props}
    />
  );
});
