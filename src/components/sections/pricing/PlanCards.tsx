import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { plans, pricingIntro, type Billing } from '@/content/pricing';
import { useDemoDialog } from '@/hooks/useDemoDialog';
import { cn } from '@/lib/cn';
import { AnimatedPrice } from './AnimatedPrice';

export interface PlanCardsProps {
  billing: Billing;
}

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

export function PlanCards({ billing }: PlanCardsProps) {
  const { openDemo } = useDemoDialog();
  return (
    <section aria-labelledby="plans-title" className="pb-section">
      <Container>
        <h2 id="plans-title" className="sr-only">
          Plans
        </h2>
        <ul className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const featured = plan.featured === true;
            return (
              <li
                key={plan.id}
                className={cn(
                  '@container relative flex flex-col rounded-lg p-8',
                  featured ? 'bg-accent text-on-accent shadow-lg' : 'border border-line bg-surface',
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <Heading level={3} size="xl" className={featured ? 'text-on-accent' : ''}>
                    {plan.name}
                  </Heading>
                  {featured && (
                    <span className="rounded-pill bg-brass-soft px-3 py-1 text-xs font-semibold text-ink">
                      {pricingIntro.featuredBadge}
                    </span>
                  )}
                </div>
                <p
                  className={cn('mt-3 text-sm', featured ? 'text-on-accent/85' : 'text-ink-muted')}
                >
                  {plan.blurb}
                </p>
                <p className="mt-8 flex items-end gap-2">
                  <span className="font-display text-metric leading-none">
                    <AnimatedPrice
                      value={plan.price[billing]}
                      direction={billing === 'annual' ? 1 : -1}
                    />
                  </span>
                </p>
                <p
                  className={cn('mt-3 text-sm', featured ? 'text-on-accent/85' : 'text-ink-muted')}
                >
                  {pricingIntro.perMonth}
                  <br />
                  {billing === 'annual'
                    ? pricingIntro.billedAnnually(gbp.format(plan.price.annual * 12))
                    : pricingIntro.billedMonthly}
                </p>
                <p className="mt-6 text-sm font-semibold">{plan.doors}</p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {plan.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <Icon
                        name="check"
                        className={cn('mt-0.5', featured ? 'text-brass-soft' : 'text-accent')}
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant={featured ? 'primary' : 'secondary'}
                  onClick={openDemo}
                  className={cn(
                    'mt-10 w-full',
                    featured && 'bg-on-accent text-accent hover:bg-brass-soft hover:text-ink',
                  )}
                  aria-label={`${pricingIntro.cta} for the ${plan.name} plan`}
                >
                  {pricingIntro.cta}
                </Button>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
