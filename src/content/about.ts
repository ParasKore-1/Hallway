export const aboutIntro = {
  eyebrow: 'About',
  title: 'Built by people who have answered the 2 a.m. boiler call.',
  lead: 'Hallway started in a lettings office in Leith, where two negotiators and an engineer counted how many evenings a year went on the same twenty questions. The answer was most of them.',
} as const;

export const timeline = {
  eyebrow: 'Our story',
  title: 'Five years, one front door.',
  items: [
    {
      year: '2021',
      title: 'The spreadsheet',
      body: 'We logged every after-hours message for six months. 62% could have been answered from a listing or a policy.',
    },
    {
      year: '2022',
      title: 'The first reply',
      body: 'A prototype answered tenant questions for one agency. Viewing no-shows fell within weeks.',
    },
    {
      year: '2023',
      title: 'Approval mode',
      body: 'Agents asked for control, so we built it. It’s still our most-loved feature.',
    },
    {
      year: '2024',
      title: 'Beyond enquiries',
      body: 'Maintenance triage and rent reminders joined viewings and enquiries.',
    },
    {
      year: '2026',
      title: 'Today',
      body: 'Hundreds of agencies, one calm inbox each. Still a small team, still in Leith.',
    },
  ],
} as const;

export const values = {
  eyebrow: 'What we value',
  title: 'How we build.',
  items: [
    {
      title: 'Calm over clever',
      body: 'Tenants should feel looked after, not processed. We choose the clear answer over the impressive one.',
    },
    {
      title: 'Agents stay in charge',
      body: 'Hallway drafts, books and reminds. People make the decisions that matter.',
    },
    {
      title: 'Honest by default',
      body: 'If Hallway doesn’t know, it says so. No invented details, ever.',
    },
    {
      title: 'Small, on purpose',
      body: 'A focused team that answers its own support tickets and visits customers’ offices.',
    },
  ],
} as const;

export const team = {
  eyebrow: 'The team',
  title: 'The people behind the door.',
  note: 'Hallway and its team are fictional — illustrative people for a portfolio project.',
  members: [
    { name: 'Isla Mackenzie', role: 'Co-founder, CEO', bio: 'Ten years as a lettings negotiator.' },
    {
      name: 'Rahul Varma',
      role: 'Co-founder, CTO',
      bio: 'Builds calm software for noisy inboxes.',
    },
    {
      name: 'Freya Lindqvist',
      role: 'Head of Design',
      bio: 'Obsessed with the space between messages.',
    },
    {
      name: 'Kwame Asante',
      role: 'Head of Customer Success',
      bio: 'Has visited 140 letting offices. Counting.',
    },
    { name: 'Nell Prior', role: 'Senior Engineer', bio: 'Keeps the replies grounded and fast.' },
    {
      name: 'Tomasz Nowak',
      role: 'Agent Partnerships',
      bio: 'Former branch manager, current tea maker.',
    },
  ],
} as const;

export const notFound = {
  eyebrow: 'Error 404',
  title: 'This door doesn’t lead anywhere.',
  lead: 'The page you’re after may have moved, or the link might be mistyped. Try one of these instead.',
  links: [
    { label: 'Homepage', to: '/' },
    { label: 'Product', to: '/product' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'About', to: '/about' },
  ],
} as const;
