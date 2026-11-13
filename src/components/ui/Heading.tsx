import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'display' | '3xl' | '2xl' | 'xl' | 'lg' | 'base';

export interface HeadingProps extends ComponentPropsWithoutRef<'h2'> {
  /** Semantic level — chosen by document outline. */
  level: HeadingLevel;
  /** Visual size — chosen by design. Defaults to a sensible size for the level. */
  size?: HeadingSize;
}

const sizeClass: Record<HeadingSize, string> = {
  display: 'font-display text-display font-[380]',
  '3xl': 'font-display text-3xl font-[400]',
  '2xl': 'font-display text-2xl font-[400]',
  xl: 'font-display text-xl font-[450]',
  lg: 'font-sans text-lg font-semibold',
  base: 'font-sans text-base font-semibold',
};

const defaultSize: Record<HeadingLevel, HeadingSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'base',
  6: 'base',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level, size, className, ...props },
  ref,
) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      ref={ref}
      className={cn('text-balance text-ink', sizeClass[size ?? defaultSize[level]], className)}
      {...props}
    />
  );
});
