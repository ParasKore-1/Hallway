import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 font-sans font-semibold whitespace-nowrap select-none',
    'transition-[background-color,color,border-color,scale] duration-(--hw-dur-fast) ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:active:scale-100',
  ],
  {
    variants: {
      variant: {
        primary: 'rounded-pill bg-accent text-on-accent hover:bg-accent-hover',
        secondary:
          'rounded-pill border border-ink bg-transparent text-ink hover:bg-ink hover:text-bg',
        ghost: 'rounded-pill text-ink hover:bg-surface-2',
        link: 'rounded-xs text-accent underline decoration-1 underline-offset-4 hover:decoration-2',
      },
      size: {
        sm: 'min-h-9 px-4 text-sm',
        md: 'min-h-11 px-6 text-sm',
        lg: 'min-h-14 px-8 text-base',
        icon: 'size-11 rounded-pill p-0',
      },
    },
    compoundVariants: [{ variant: 'link', size: ['sm', 'md', 'lg'], class: 'min-h-0 px-0' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
