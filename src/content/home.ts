import type { FaqItem } from './types';

export interface ChatMessage {
  readonly from: 'tenant' | 'hallway' | 'system';
  readonly text: string;
  readonly time?: string;
}

export interface Conversation {
  readonly id: string;
  readonly name: string;
  readonly preview: string;
  readonly time: string;
  readonly tag: string;
  readonly unread?: boolean;
}

export interface Stat {
  readonly value: string;
  readonly label: string;
  readonly footnote?: boolean;
}

export interface Feature {
  readonly id: 'replies' | 'viewings' | 'maintenance' | 'rent' | 'approval' | 'handover';
  readonly title: string;
  readonly body: string;
}

export interface Step {
  readonly number: string;
  readonly title: string;
  readonly body: string;
  readonly detail: readonly string[];
}

export interface DemoView {
  readonly id: 'enquiries' | 'viewings' | 'maintenance';
  readonly label: string;
  readonly title: string;
  readonly summary: string;
  readonly thread: readonly ChatMessage[];
  readonly outcome: {
    readonly label: string;
    readonly rows: readonly (readonly [string, string])[];
  };
}

export interface Metric {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly decimals?: number;
  readonly label: string;
}

export interface Testimonial {
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly agency: string;
}

export interface Agency {
  readonly name: string;
  readonly style: 'serif' | 'caps' | 'mono' | 'italic';
  readonly glyph: 'arch' | 'circle' | 'diamond' | 'leaf' | 'bars' | 'key';
}

export const hero = {
  eyebrow: 'AI operations for UK letting agents',
  /** Headline words; the word flagged `highlight` gets the brass marker. */
  headline: [
    { word: 'Every' },
    { word: 'tenant' },
    { word: 'enquiry,' },
    { word: 'answered', highlight: true },
    { word: 'before' },
    { word: 'the' },
    { word: 'kettle' },
    { word: 'boils.' },
  ],
  lead: 'Hallway is the calm, always-on front desk for letting agents. It replies to tenants in your voice, books viewings straight into your diary, triages repairs and nudges late rent — then hands your team a tidy summary each morning.',
  primaryCta: 'Book a demo',
  secondaryCta: 'See how it works',
  reassurance: ['No setup fee', 'Live in a week', 'Works with your CRM'],
  trustedBy: 'Trusted by independent agencies from Penzance to Perth',
} as const;

export const agencies: readonly Agency[] = [
  { name: 'Brindle & Oak', style: 'serif', glyph: 'leaf' },
  { name: 'FERNHOLLOW', style: 'caps', glyph: 'arch' },
  { name: 'quillgate homes', style: 'mono', glyph: 'bars' },
  { name: 'Larkmoor', style: 'italic', glyph: 'circle' },
  { name: 'SALTMARSH LETS', style: 'caps', glyph: 'diamond' },
  { name: 'Copperleaf', style: 'serif', glyph: 'key' },
];

export const mockInbox = {
  title: 'Inbox',
  live: 'Live',
  conversations: [
    {
      id: 'c1',
      name: 'Priya S.',
      preview: 'Could I view Thursday after work?',
      time: '21:42',
      tag: 'Viewing',
      unread: true,
    },
    {
      id: 'c2',
      name: 'Tom W.',
      preview: 'Boiler’s making a banging noise',
      time: '21:17',
      tag: 'Repair',
    },
    {
      id: 'c3',
      name: 'Ama O.',
      preview: 'Is the deposit protected?',
      time: '20:55',
      tag: 'Enquiry',
    },
    {
      id: 'c4',
      name: 'Lewis R.',
      preview: 'Paid — sorry it was late!',
      time: '19:03',
      tag: 'Rent',
    },
  ] satisfies Conversation[],
  thread: [
    {
      from: 'tenant',
      text: 'Hi! Is the 2-bed on Elm Row still available? Could I view Thursday after work?',
      time: '21:42',
    },
    {
      from: 'hallway',
      text: 'Hi Priya — yes, 12 Elm Row is available from 1 March at £1,450 pcm. I have Thursday at 17:30 or 18:15. Shall I book one?',
      time: '21:42',
    },
    { from: 'tenant', text: '18:15 please 🙌', time: '21:43' },
    { from: 'system', text: 'Viewing booked · Thu 18:15 · Sam (negotiator)' },
  ] satisfies ChatMessage[],
  composer: 'Hallway is replying in your agency’s voice…',
  details: {
    title: 'Lead',
    rows: [
      ['Property', '12 Elm Row, Leith'],
      ['Budget', '£1,500 pcm'],
      ['Move-in', 'March'],
      ['Score', 'Warm'],
    ],
  },
} as const;

export const problem = {
  eyebrow: 'The problem',
  title: 'Tenants don’t keep office hours. Your inbox shouldn’t have to.',
  lead: 'Most enquiries land when the office is closed. By the time someone replies, the applicant has viewed somewhere else and the repair has turned into a ceiling.',
  stats: [
    { value: '62%', label: 'of tenant enquiries arrive outside office hours', footnote: true },
    { value: '4h 30m', label: 'average first response time to a portal lead', footnote: true },
    { value: '1 in 3', label: 'booked viewings end up as no-shows', footnote: true },
  ] satisfies Stat[],
  solution: {
    eyebrow: 'With Hallway',
    title: 'A front desk that never clocks off.',
    points: [
      { value: '< 1 min', label: 'first reply, any hour, every channel' },
      { value: '24 / 7', label: 'viewing booking straight into negotiator diaries' },
      { value: '−38%', label: 'fewer no-shows with smart reminders', footnote: true },
    ] satisfies Stat[],
  },
  footnote:
    'Figures marked * are illustrative, created for this fictional product, and not drawn from real research.',
} as const;

export const features = {
  eyebrow: 'What Hallway does',
  title: 'Six jobs your team will happily never do again.',
  items: [
    {
      id: 'replies',
      title: 'Instant replies, in your voice',
      body: 'Trained on your listings, policies and tone. Answers questions about pets, parking and deposits accurately — and says “let me check” when it should.',
    },
    {
      id: 'viewings',
      title: 'Viewings that book themselves',
      body: 'Offers real slots from negotiator diaries, confirms, reminds and rebooks.',
    },
    {
      id: 'maintenance',
      title: 'Maintenance, triaged',
      body: 'Photos, urgency and access details collected up front, then routed to the right contractor.',
    },
    {
      id: 'rent',
      title: 'Rent reminders that stay polite',
      body: 'Gentle nudges before and after due dates, with escalation rules you set.',
    },
    {
      id: 'approval',
      title: 'A human in the loop',
      body: 'Approve sensitive replies before they send. Hallway learns from every edit.',
    },
    {
      id: 'handover',
      title: 'The morning handover',
      body: 'Overnight activity summarised into one calm list: what happened, what needs you, what’s already done.',
    },
  ] satisfies Feature[],
} as const;

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'From first conversation to fully live in four steps.',
  steps: [
    {
      number: '01',
      title: 'Connect',
      body: 'Link your listings, negotiator diaries and CRM. Read-only to start; nothing changes until you say so.',
      detail: ['Portal feeds', 'Calendars', 'CRM'],
    },
    {
      number: '02',
      title: 'Teach',
      body: 'Upload your FAQs, policies and a few great replies. Hallway learns your tone and your rules.',
      detail: ['Tone of voice', 'Pet & deposit policies', 'Escalation rules'],
    },
    {
      number: '03',
      title: 'Go live',
      body: 'Switch on website chat, email and messaging. Start in approval mode, then let it fly.',
      detail: ['Website chat', 'Email', 'Messaging apps'],
    },
    {
      number: '04',
      title: 'Review',
      body: 'Each morning, a handover of everything that happened overnight — and the few things that need a human.',
      detail: ['Daily handover', 'Edits as training', 'Weekly insights'],
    },
  ] satisfies Step[],
} as const;

export const demo = {
  eyebrow: 'See it work',
  title: 'One inbox. Three kinds of evening.',
  lead: 'Switch between the conversations Hallway handles most. Every outcome lands in your CRM, structured and ready.',
  views: [
    {
      id: 'enquiries',
      label: 'Enquiries',
      title: 'A portal lead at 23:08',
      summary: 'Qualified, answered and scored before the applicant closes the tab.',
      thread: [
        { from: 'tenant', text: 'Do you allow cats at the Castle Street flat?' },
        {
          from: 'hallway',
          text: 'Good question! The landlord accepts one cat with an additional £150 deposit. Would you like to book a viewing?',
        },
        { from: 'tenant', text: 'Yes — weekends are best.' },
      ],
      outcome: {
        label: 'Lead captured',
        rows: [
          ['Pets', '1 cat'],
          ['Availability', 'Weekends'],
          ['Score', 'Hot'],
        ],
      },
    },
    {
      id: 'viewings',
      label: 'Viewings',
      title: 'Rebooking at 07:15',
      summary: 'Diaries checked, slot moved, everyone reminded — no phone tag.',
      thread: [
        { from: 'tenant', text: 'Running late from work, can I move my 18:00 viewing?' },
        {
          from: 'hallway',
          text: 'No problem. Sam can do 18:45 today or 09:30 tomorrow. Which suits?',
        },
        { from: 'tenant', text: '18:45 is perfect, thanks!' },
      ],
      outcome: {
        label: 'Viewing moved',
        rows: [
          ['New time', 'Today 18:45'],
          ['Negotiator', 'Sam'],
          ['Reminder', 'Sent'],
        ],
      },
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      title: 'A leak at 02:31',
      summary: 'Urgency assessed, safety advice given, contractor booked.',
      thread: [
        { from: 'tenant', text: 'Water is dripping through the kitchen ceiling!' },
        {
          from: 'hallway',
          text: 'Sorry to hear that. Please turn off the stopcock under the sink if you can. Could you send a photo? I’m alerting our emergency plumber now.',
        },
        { from: 'system', text: 'Photo received · Marked urgent' },
      ],
      outcome: {
        label: 'Job raised',
        rows: [
          ['Priority', 'Emergency'],
          ['Contractor', 'On the way'],
          ['ETA', '45 min'],
        ],
      },
    },
  ] satisfies DemoView[],
} as const;

export const metrics = {
  eyebrow: 'By the numbers',
  title: 'Quietly doing the heavy lifting.',
  items: [
    { value: 1.2, suffix: 'M', decimals: 1, label: 'tenant messages handled' },
    { value: 41, suffix: 's', label: 'median first reply' },
    { value: 9800, label: 'viewings booked last month' },
    { value: 96, suffix: '%', label: 'of tenants rate replies helpful' },
  ] satisfies Metric[],
  footnote: 'Illustrative figures for a fictional product.',
} as const;

export const testimonials = {
  eyebrow: 'From agents',
  title: 'Fewer late nights. Happier tenants.',
  badge: 'Fictional',
  items: [
    {
      quote:
        'We used to start every Monday with sixty unanswered emails. Now we start with a two-minute summary and a coffee.',
      name: 'Rosa Penhallow',
      role: 'Lettings Director',
      agency: 'Brindle & Oak',
    },
    {
      quote:
        'Our viewing no-shows dropped within a month. The reminders are friendlier than anything we ever wrote.',
      name: 'Dev Okonkwo-Hart',
      role: 'Founder',
      agency: 'Fernhollow Lets',
    },
    {
      quote:
        'The approval mode sold it for us. Nothing goes out that we wouldn’t have said ourselves.',
      name: 'Harriet Quill',
      role: 'Head of Property Management',
      agency: 'Larkmoor',
    },
  ] satisfies Testimonial[],
} as const;

export const integrations = {
  eyebrow: 'Integrations',
  title: 'Fits the tools you already use.',
  lead: 'Hallway sits between your channels and your systems, so nothing needs replacing.',
  items: [
    'Property portals',
    'CRM',
    'Calendars',
    'Accounting',
    'Messaging apps',
    'Email',
    'Website chat',
    'Contractors',
  ],
} as const;

export const pricingTeaser = {
  eyebrow: 'Pricing',
  title: 'Priced per portfolio, not per headache.',
  lead: 'Three plans, no setup fees, cancel any time. Save 20% when you pay annually.',
  plans: [
    { name: 'Starter', price: '£149', note: 'up to 150 doors' },
    { name: 'Growth', price: '£349', note: 'up to 600 doors', featured: true },
    { name: 'Portfolio', price: '£799', note: 'unlimited doors' },
  ],
  cta: 'Compare plans',
} as const;

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions agents ask us.',
  items: [
    {
      id: 'replace',
      question: 'Does Hallway replace my negotiators?',
      answer:
        'No. Hallway handles the repetitive first response — availability, policies, bookings, reminders — so your team can spend their time on viewings, valuations and landlords.',
    },
    {
      id: 'wrong',
      question: 'What happens if it doesn’t know an answer?',
      answer:
        'It says so, tells the tenant when they’ll hear back, and flags the conversation for a human. It never invents details about a property.',
    },
    {
      id: 'approval',
      question: 'Can we approve messages before they’re sent?',
      answer:
        'Yes. Approval mode routes replies to your team first, either for everything or only for topics you choose, such as rent arrears or complaints.',
    },
    {
      id: 'data',
      question: 'Where is tenant data stored?',
      answer:
        'In this fictional world: UK data centres, encrypted at rest and in transit, with role-based access and full audit logs.',
    },
    {
      id: 'setup',
      question: 'How long does setup take?',
      answer:
        'Most agencies are live within a week. We connect your systems, import your policies and run in approval mode until you’re confident.',
    },
    {
      id: 'contract',
      question: 'Is there a long contract?',
      answer: 'No. Monthly plans cancel any time; annual plans are paid up front for a 20% saving.',
    },
  ] satisfies FaqItem[],
} as const;

export const closing = {
  eyebrow: 'Ready when you are',
  title: 'Every enquiry,',
  kinetic: 'answered.',
  lead: 'Give your team their evenings back. See Hallway with your own listings in a 20-minute demo.',
  primaryCta: 'Book a demo',
  secondaryCta: 'See pricing',
} as const;
