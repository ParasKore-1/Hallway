import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  /** page = 1440px max, prose = 68ch reading measure, narrow = 56rem. */
  size?: 'page' | 'prose' | 'narrow';
}

const sizes = {
  page: 'max-w-page',
  prose: 'max-w-prose',
  narrow: 'max-w-4xl',
} as const;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'page', className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('mx-auto w-full px-gutter', sizes[size], className)} {...props} />
  );
});
