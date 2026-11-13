import { useGsapContext } from '@/hooks/useGsapContext';
import { hasPassedRevealLine } from '@/lib/gsap';
import { cn } from '@/lib/cn';

export interface KineticWordProps {
  text: string;
  className?: string;
}

/**
 * Letters rise out of a mask with a staggered, slightly rotated spring, then a brass rule
 * draws underneath. Transform-only. The real word is exposed once to assistive tech; the
 * per-letter spans are aria-hidden. Reduced motion: letters fade in together, rule static.
 */
export function KineticWord({ text, className }: KineticWordProps) {
  const ref = useGsapContext<HTMLSpanElement>(({ scope, reduced, gsap }) => {
    if (hasPassedRevealLine(scope, 0.8)) return;
    const letters = scope.querySelectorAll('[data-letter]');
    const rule = scope.querySelector('[data-rule]');
    const trigger = { trigger: scope, start: 'top 80%', once: true };
    if (reduced) {
      gsap.from(letters, { opacity: 0, duration: 0.3, scrollTrigger: trigger });
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: trigger });
    tl.from(letters, {
      yPercent: 110,
      rotate: 8,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.045,
    }).from(rule, { scaleX: 0, duration: 0.9, ease: 'power4.inOut' }, '-=0.6');
  });

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="line-mask inline-flex">
        {Array.from(text).map((char, index) => (
          <span key={`${char}-${index}`} data-letter className="inline-block origin-bottom-left">
            {char}
          </span>
        ))}
      </span>
      <span
        aria-hidden="true"
        data-rule
        className="absolute inset-x-0 -bottom-[0.06em] block h-[0.06em] origin-left rounded-pill bg-brass-soft"
      />
    </span>
  );
}
