import { AnimatePresence, m } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { easing } from '@/lib/motion';

export interface AnimatedPriceProps {
  value: number;
  /** Direction of travel: annual (lower) slides down, monthly slides up. */
  direction: 1 | -1;
}

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

/** Price that rolls to its new value (transform/opacity). Reduced motion: instant swap. */
export function AnimatedPrice({ value, direction }: AnimatedPriceProps) {
  const reduced = useReducedMotion();
  return (
    <span className="tabular relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          className="inline-block"
          initial={reduced ? { opacity: 0 } : { y: `${direction * -100}%`, opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: `${direction * 100}%`, opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.5, ease: easing.outExpo }}
        >
          {gbp.format(value)}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
