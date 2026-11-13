import { useGsapContext } from '@/hooks/useGsapContext';
import { hasPassedRevealLine } from '@/lib/gsap';

export interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

const formatter = (decimals: number) =>
  new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Counts up when scrolled into view. The final value is rendered in the HTML (SEO, no-JS and
 * screen readers read the sr-only copy); the animated digits are aria-hidden so assistive tech
 * never hears intermediate numbers. Tabular figures keep the width stable (no layout shift).
 */
export function Counter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CounterProps) {
  const format = formatter(decimals);
  const final = `${prefix}${format.format(value)}${suffix}`;

  const ref = useGsapContext<HTMLSpanElement>(({ scope, reduced, gsap }) => {
    if (reduced || hasPassedRevealLine(scope, 0.85)) return;
    const digits = scope.querySelector<HTMLElement>('[data-digits]');
    if (!digits) return;
    const state = { n: 0 };
    gsap.to(state, {
      n: value,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: scope, start: 'top 85%', once: true },
      onStart: () => {
        digits.textContent = `${prefix}${format.format(0)}${suffix}`;
      },
      onUpdate: () => {
        digits.textContent = `${prefix}${format.format(state.n)}${suffix}`;
      },
    });
  });

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" data-digits className="tabular">
        {final}
      </span>
    </span>
  );
}
