import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { useGsapContext } from '@/hooks/useGsapContext';
import { isCovered, onIntroReady } from '@/lib/intro';

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
}

/**
 * Inner-page hero. Its entrance plays under the route curtain (which covers the page while it
 * mounts), so hiding the start state never flashes. Reduced motion: no animation.
 */
export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  const ref = useGsapContext<HTMLElement>(
    ({ scope, reduced, gsap }) => {
      if (reduced || !isCovered()) return;
      const items = scope.querySelectorAll('[data-hero-item]');
      gsap.set(items, { y: 40, opacity: 0 });
      return onIntroReady(() => {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.3,
          clearProps: 'transform,opacity',
        });
      });
    },
    { eager: true },
  );
  return (
    <section ref={ref} aria-labelledby="page-title" className="pt-16 pb-12 md:pt-24 md:pb-16">
      <Container>
        <p className="eyebrow" data-hero-item>
          {eyebrow}
        </p>
        <Heading
          level={1}
          size="display"
          id="page-title"
          className="mt-6 max-w-[16ch]"
          data-hero-item
        >
          {title}
        </Heading>
        <Text size="lg" tone="muted" className="mt-8 max-w-[58ch]" data-hero-item>
          {lead}
        </Text>
        {children && <div data-hero-item>{children}</div>}
      </Container>
    </section>
  );
}
