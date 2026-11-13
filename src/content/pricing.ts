export type Billing = 'monthly' | 'annual';

export interface Plan {
  readonly id: 'starter' | 'growth' | 'portfolio';
  readonly name: string;
  readonly blurb: string;
  readonly doors: string;
  readonly price: Record<Billing, number>;
  readonly featured?: boolean;
  readonly highlights: readonly string[];
}

/** true = included, false = not included, string = specific value. */
export type CellValue = boolean | string;

export interface ComparisonRow {
  readonly feature: string;
  readonly values: Record<Plan['id'], CellValue>;
}

export interface ComparisonGroup {
  readonly title: string;
  readonly rows: readonly ComparisonRow[];
}

export const pricingIntro = {
  eyebrow: 'Pricing',
  title: 'Priced per portfolio, not per headache.',
  lead: 'Every plan includes unlimited conversations, every channel and approval mode. No setup fees, no long contracts.',
  billingLabel: 'Billing period',
  monthly: 'Monthly',
  annual: 'Annual',
  annualSaving: 'Save 20%',
  perMonth: 'per month, ex. VAT',
  billedAnnually: (total: string) => `Billed annually at ${total}`,
  billedMonthly: 'Billed monthly, cancel any time',
  announceMonthly: 'Showing monthly prices.',
  announceAnnual: 'Showing annual prices, 20% lower.',
  cta: 'Book a demo',
  featuredBadge: 'Most popular',
} as const;

export const plans: readonly Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For independents getting their evenings back.',
    doors: 'Up to 150 doors',
    price: { monthly: 149, annual: 119 },
    highlights: ['Website chat & email', 'Viewing booking', 'Morning handover'],
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'For busy branches with a lettings team.',
    doors: 'Up to 600 doors',
    price: { monthly: 349, annual: 279 },
    featured: true,
    highlights: ['Everything in Starter', 'Maintenance triage', 'Rent reminders', 'CRM sync'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    blurb: 'For multi-branch agencies and property managers.',
    doors: 'Unlimited doors',
    price: { monthly: 799, annual: 639 },
    highlights: [
      'Everything in Growth',
      'Multi-branch routing',
      'SSO & audit exports',
      'Named success manager',
    ],
  },
];

export const comparison: readonly ComparisonGroup[] = [
  {
    title: 'Conversations',
    rows: [
      {
        feature: 'Doors under management',
        values: { starter: '150', growth: '600', portfolio: 'Unlimited' },
      },
      { feature: 'Website chat & email', values: { starter: true, growth: true, portfolio: true } },
      { feature: 'Messaging apps', values: { starter: false, growth: true, portfolio: true } },
      { feature: 'Portal lead replies', values: { starter: true, growth: true, portfolio: true } },
    ],
  },
  {
    title: 'Operations',
    rows: [
      {
        feature: 'Viewing booking & reminders',
        values: { starter: true, growth: true, portfolio: true },
      },
      { feature: 'Maintenance triage', values: { starter: false, growth: true, portfolio: true } },
      { feature: 'Rent reminders', values: { starter: false, growth: true, portfolio: true } },
      {
        feature: 'Multi-branch routing',
        values: { starter: false, growth: false, portfolio: true },
      },
    ],
  },
  {
    title: 'Control & support',
    rows: [
      { feature: 'Approval mode', values: { starter: true, growth: true, portfolio: true } },
      { feature: 'CRM sync', values: { starter: false, growth: true, portfolio: true } },
      {
        feature: 'SSO & audit exports',
        values: { starter: false, growth: false, portfolio: true },
      },
      {
        feature: 'Support',
        values: { starter: 'Email', growth: 'Priority', portfolio: 'Named manager' },
      },
    ],
  },
];

export const comparisonCopy = {
  eyebrow: 'Compare',
  title: 'Every plan, side by side.',
  caption: 'Feature comparison of Hallway plans',
  included: 'Included',
  notIncluded: 'Not included',
} as const;
