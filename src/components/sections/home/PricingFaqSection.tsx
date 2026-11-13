import { Link as RouterLink } from 'react-router';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/sections/shared/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { faq, pricingTeaser } from '@/content/home';
import { cn } from '@/lib/cn';

export function PricingFaqSection() {
  return (
    <Section labelledBy="pricing-teaser-title">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div>
          <SectionHeader
            id="pricing-teaser-title"
            eyebrow={pricingTeaser.eyebrow}
            title={pricingTeaser.title}
            lead={pricingTeaser.lead}
          />
          <Reveal stagger className="mt-10 grid gap-3">
            {pricingTeaser.plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'flex items-baseline justify-between gap-4 rounded-md px-5 py-4',
                  'featured' in plan ? 'bg-accent text-on-accent' : 'border border-line',
                )}
              >
                <span className="font-semibold">{plan.name}</span>
                <span className="text-right">
                  <span className="font-display text-2xl">{plan.price}</span>
                  <span className="text-sm opacity-80"> /mo · {plan.note}</span>
                </span>
              </div>
            ))}
          </Reveal>
          <Button
            asChild
            variant="secondary"
            className="mt-8"
            iconEnd={<Icon name="arrow-right" />}
            data-magnetic
          >
            <RouterLink to="/pricing">{pricingTeaser.cta}</RouterLink>
          </Button>
        </div>
        <div>
          <p className="eyebrow">{faq.eyebrow}</p>
          <Heading level={2} size="2xl" id="faq-title" className="mt-5">
            {faq.title}
          </Heading>
          <Accordion
            className="mt-10"
            headingLevel={3}
            items={faq.items.map((item) => ({
              id: item.id,
              title: item.question,
              content: <p>{item.answer}</p>,
            }))}
          />
        </div>
      </Container>
    </Section>
  );
}
