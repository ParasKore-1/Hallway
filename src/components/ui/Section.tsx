import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /** id of the heading that names this section (required for a labelled landmark). */
  labelledBy: string;
  /** default = page background, muted = surface-2 band, dark = always-dark band. */
  tone?: 'default' | 'muted' | 'dark';
  /** Vertical rhythm. `none` lets the section manage its own spacing (pinned scenes). */
  spacing?: 'default' | 'compact' | 'none';
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { labelledBy, tone = 'default', spacing = 'default', className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      aria-labelledby={labelledBy}
      {...(tone === 'dark' ? { 'data-theme': 'dark' } : {})}
      className={cn(
        'relative',
        tone === 'muted' && 'bg-surface-2',
        spacing === 'default' && 'py-section',
        spacing === 'compact' && 'py-16 md:py-20',
        className,
      )}
      {...props}
    />
  );
});
