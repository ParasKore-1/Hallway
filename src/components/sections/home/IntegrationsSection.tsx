import type { CSSProperties } from 'react';
import { Logo } from '@/components/layout/Logo';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { integrations } from '@/content/home';

/**
 * One list, two layouts: a chip grid below 1024px, an orbit around the Hallway mark above.
 * The orbit drifts slowly (CSS), pauses on hover/focus, and is static for reduced motion.
 */
export function IntegrationsSection() {
  const count = integrations.items.length;
  return (
    <Section
      labelledBy="integrations-title"
      tone="muted"
      id="integrations"
      className="defer-render"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeader
          id="integrations-title"
          eyebrow={integrations.eyebrow}
          title={integrations.title}
          lead={integrations.lead}
        />
        <div className="orbit relative lg:mx-auto lg:aspect-square lg:w-full lg:max-w-[34rem]">
          <div aria-hidden="true" className="absolute inset-0 hidden place-items-center lg:grid">
            <span className="absolute inset-[12%] rounded-pill border border-dashed border-ink-muted/40" />
            <span className="absolute inset-[30%] rounded-pill border border-line" />
            <span className="relative grid size-28 place-items-center rounded-pill bg-bg shadow-md">
              <Logo className="scale-90" />
            </span>
          </div>
          <ul className="orbit-ring grid grid-cols-2 gap-3 sm:grid-cols-4 lg:absolute lg:inset-0 lg:block">
            {integrations.items.map((item, index) => (
              <li
                key={item}
                style={{ '--angle': `${(360 / count) * index}deg` } as CSSProperties}
                className="lg:absolute lg:top-1/2 lg:left-1/2 lg:size-0 lg:[transform:rotate(var(--angle))_translateX(min(15rem,38vw))_rotate(calc(var(--angle)*-1))]"
              >
                <span className="orbit-upright flex min-h-12 items-center justify-center rounded-pill bg-bg px-4 text-center text-sm font-semibold text-ink shadow-xs lg:-translate-x-1/2 lg:-translate-y-1/2 lg:whitespace-nowrap">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
