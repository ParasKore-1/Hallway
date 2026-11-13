import type { PageIntro, PageMeta } from './types';

export const pageMeta = {
  home: {
    path: '/',
    title: 'Hallway — AI operations for UK letting agents',
    description:
      'Hallway answers tenant enquiries, books viewings, triages maintenance and chases rent around the clock — so letting agents can stop firefighting and start growing.',
  },
  product: {
    path: '/product',
    title: 'Product',
    description:
      'See how Hallway turns a stream of tenant messages into qualified leads, booked viewings, logged repairs and rent paid on time.',
  },
  pricing: {
    path: '/pricing',
    title: 'Pricing',
    description:
      'Simple monthly or annual plans for letting agents of every size. Compare Hallway’s Starter, Growth and Portfolio plans.',
  },
  about: {
    path: '/about',
    title: 'About',
    description:
      'Hallway was built by former letting negotiators and engineers who wanted to give agents their evenings back.',
  },
  playground: {
    path: '/playground',
    title: 'Design system playground',
    description: 'Every Hallway UI component in every state, in light and dark themes.',
    noindex: true,
  },
  notFound: {
    path: '/404',
    title: 'Page not found',
    description: 'This door doesn’t lead anywhere. Head back to the Hallway homepage.',
    noindex: true,
  },
} as const satisfies Record<string, PageMeta>;

export const pageIntros = {
  playground: {
    eyebrow: 'Design system',
    title: 'Playground',
    lead: 'Every Hallway component, in every state, in both themes. Use the keyboard — it all works.',
  },
} as const satisfies Record<string, PageIntro>;
