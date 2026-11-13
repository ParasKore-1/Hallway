export interface StoryStep {
  readonly id: 'arrive' | 'qualify' | 'book' | 'follow';
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
}

export const productIntro = {
  eyebrow: 'Product',
  title: 'One quiet layer between your tenants and your team.',
  lead: 'Follow a single enquiry through Hallway — from a message at 21:42 to a viewing in the diary and a lead in your CRM — without anyone lifting a phone.',
} as const;

export const story = {
  title: 'The life of an enquiry',
  steps: [
    {
      id: 'arrive',
      eyebrow: '21:42 · Arrive',
      title: 'A message lands after hours.',
      body: 'Website chat, email, a portal lead or a messaging app — Hallway listens on every channel and replies within seconds, in your agency’s voice.',
      points: [
        'Every channel in one inbox',
        'Replies in under a minute',
        'Your tone, your sign-off',
      ],
    },
    {
      id: 'qualify',
      eyebrow: '21:42 · Qualify',
      title: 'It asks the questions you would.',
      body: 'Budget, move-in date, pets, guarantor — Hallway gathers what your negotiators need, politely, and scores the lead as it goes.',
      points: [
        'Your qualifying rules',
        'Policies answered accurately',
        '“Let me check” when unsure',
      ],
    },
    {
      id: 'book',
      eyebrow: '21:43 · Book',
      title: 'The viewing books itself.',
      body: 'Real slots from real diaries. Hallway confirms, sends a calendar invite and reminds everyone the day before — and rebooks if plans change.',
      points: ['Live diary availability', 'Reminders that cut no-shows', 'One-tap rebooking'],
    },
    {
      id: 'follow',
      eyebrow: '08:30 · Follow up',
      title: 'Your team starts the day ahead.',
      body: 'The morning handover lists what happened overnight. The lead is already in your CRM with the full conversation attached.',
      points: ['Morning handover', 'CRM sync', 'Edits become training'],
    },
  ] satisfies StoryStep[],
} as const;

export const productPillars = {
  eyebrow: 'Built for trust',
  title: 'Helpful by default. Careful by design.',
  items: [
    {
      title: 'Approval mode',
      body: 'Route any topic — arrears, complaints, deposits — to a human before a reply is sent.',
    },
    {
      title: 'Grounded answers',
      body: 'Hallway only answers from your listings and policies. If it doesn’t know, it says so and flags it.',
    },
    {
      title: 'Full audit trail',
      body: 'Every message, edit and decision is logged with who, when and why.',
    },
  ],
} as const;
