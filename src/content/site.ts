import type { DemoFormContent, SiteContent } from './types';

export const site = {
  name: 'Hallway',
  tagline: 'The calm front door for every tenant conversation.',
  description:
    'Hallway answers tenant enquiries, books viewings, triages maintenance and chases rent — so UK letting agents can stop firefighting and start growing.',
  nav: [
    { label: 'Product', to: '/product' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'About', to: '/about' },
  ],
  skipLinkLabel: 'Skip to main content',
  cta: { demo: 'Book a demo', pricing: 'See pricing', product: 'Explore the product' },
  footer: {
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'How it works', to: '/product' },
          { label: 'Pricing', to: '/pricing' },
          { label: 'Integrations', to: '/#integrations' },
          { label: 'FAQ', to: '/pricing#faq' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', to: '/about' },
          { label: 'Our values', to: '/about#values' },
          { label: 'Team', to: '/about#team' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Design system', to: '/playground' },
          { label: 'Source code', to: 'https://github.com/' },
        ],
      },
    ],
    legal: '© 2026 Hallway. A portfolio project — not a real company.',
    fictionNotice:
      'Agencies, people, quotes and figures on this site are fictional and for illustration only.',
    backToTop: 'Back to top',
  },
} as const satisfies SiteContent;

export const demoForm = {
  title: 'Book a 20-minute demo',
  description:
    'We’ll walk through Hallway using your own listings and the questions your tenants actually ask.',
  nameLabel: 'Your name',
  emailLabel: 'Work email',
  emailError: 'Enter an email address like name@agency.co.uk.',
  doorsLabel: 'Doors under management',
  doorsPlaceholder: 'Choose a range',
  doorsOptions: ['Under 100', '100–500', '500–2,000', 'More than 2,000'],
  note: 'This is a portfolio demo — nothing is sent anywhere.',
  submit: 'Request demo',
  submitting: 'Sending…',
  successTitle: 'Demo requested',
  successBody: 'Thanks — in a real world, someone from Hallway would be in touch within a day.',
} as const satisfies DemoFormContent;
