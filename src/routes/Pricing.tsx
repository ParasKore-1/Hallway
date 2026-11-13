import { useState } from 'react';
import { Seo } from '@/app/Seo';
import { HydrationBoundary } from '@/components/layout/HydrationBoundary';
import { BillingToggle } from '@/components/sections/pricing/BillingToggle';
import { ComparisonTable } from '@/components/sections/pricing/ComparisonTable';
import { PlanCards } from '@/components/sections/pricing/PlanCards';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { faq } from '@/content/home';
import { pageMeta } from '@/content/pages';
import { pricingIntro, type Billing } from '@/content/pricing';

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('monthly');
  return (
    <>
      <Seo meta={pageMeta.pricing} />
      <PageHero eyebrow={pricingIntro.eyebrow} title={pricingIntro.title} lead={pricingIntro.lead}>
        <BillingToggle value={billing} onChange={setBilling} />
        <p aria-live="polite" className="sr-only">
          {billing === 'annual' ? pricingIntro.announceAnnual : pricingIntro.announceMonthly}
        </p>
      </PageHero>
      <PlanCards billing={billing} />
      <HydrationBoundary>
        <ComparisonTable />
      </HydrationBoundary>
      <Section labelledBy="faq-title" id="faq">
        <Container size="narrow">
          <p className="eyebrow">{faq.eyebrow}</p>
          <Heading level={2} size="2xl" id="faq-title" className="mt-5">
            {faq.title}
          </Heading>
          <Accordion
            className="mt-10"
            items={faq.items.map((item) => ({
              id: item.id,
              title: item.question,
              content: <p>{item.answer}</p>,
            }))}
          />
        </Container>
      </Section>
    </>
  );
}
