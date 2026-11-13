import { Slot, Slottable } from '@radix-ui/react-slot';
import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants, type ButtonVariantProps } from './buttonVariants';
import { Spinner } from './Spinner';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'>, ButtonVariantProps {
  /** Render the single child element (e.g. a router Link) with button styling. */
  asChild?: boolean;
  /** Shows a spinner, sets aria-busy and blocks activation while keeping focus. */
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild = false,
    loading = false,
    variant,
    size,
    className,
    iconStart,
    iconEnd,
    children,
    onClick,
    type,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...(loading ? { 'aria-busy': true, 'aria-disabled': true } : {})}
      {...props}
    >
      {loading ? <Spinner /> : iconStart}
      <Slottable>{children}</Slottable>
      {!loading && iconEnd}
    </Comp>
  );
});
