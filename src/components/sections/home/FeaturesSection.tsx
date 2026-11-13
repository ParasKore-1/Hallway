import { Spotlight } from '@/components/motion/Spotlight';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { features, type Feature } from '@/content/home';
import { useGsapContext } from '@/hooks/useGsapContext';
import { cn } from '@/lib/cn';
import { hasPassedRevealLine } from '@/lib/gsap';
import { FeatureVignette } from './FeatureVignette';

/** Bento placement: varied sizes on desktop, two columns on tablet, one on mobile. */
const layout: Record<Feature['id'], string> = {
  replies: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
  viewings: 'lg:col-span-2',
  maintenance: '',
  rent: '',
  approval: '',
  handover: 'md:col-span-2 lg:col-span-3',
};

/**
 * Six-card bento. Motion: cards are revealed with a clip-path wipe from the bottom as the grid
 * enters, and a cursor-following spotlight brightens the hovered card (fine pointers).
 * Reduced motion: simple fade, no spotlight.
 */
export function FeaturesSection() {
  const ref = useGsapContext<HTMLUListElement>(({ scope, reduced, gsap }) => {
    if (hasPassedRevealLine(scope, 0.8)) return;
    const cards = scope.querySelectorAll<HTMLElement>('[data-bento]');
    if (reduced) {
      gsap.from(cards, {
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        scrollTrigger: { trigger: scope, start: 'top 85%', once: true },
      });
      return;
    }
    gsap.fromTo(
      cards,
      { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 24px)',
        duration: 1.1,
        ease: 'expo.inOut',
        stagger: 0.09,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: scope, start: 'top 80%', once: true },
      },
    );
  });

  return (
    <Section labelledBy="features-title" tone="muted">
      <Container>
        <SectionHeader id="features-title" eyebrow={features.eyebrow} title={features.title} />
        <ul
          ref={ref}
          className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.items.map((feature) => (
            <li
              key={feature.id}
              data-bento
              className={cn(
                'group relative flex flex-col justify-between gap-8 overflow-hidden rounded-lg bg-bg p-6 md:p-8',
                layout[feature.id],
              )}
            >
              <Spotlight />
              <div className="relative">
                <Heading level={3} size="xl" className="max-w-[18ch]">
                  {feature.title}
                </Heading>
                <p className="mt-3 max-w-[46ch] text-sm text-pretty text-ink-muted">
                  {feature.body}
                </p>
              </div>
              <div className="relative rounded-md bg-surface-2/70 p-4">
                <FeatureVignette id={feature.id} />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
