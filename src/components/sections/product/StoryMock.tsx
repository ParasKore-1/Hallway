import { ChatBubble } from '@/components/sections/shared/ChatBubble';
import { Icon } from '@/components/ui/Icon';
import type { ChatMessage } from '@/content/home';
import type { StoryStep } from '@/content/product';
import { cn } from '@/lib/cn';

export interface StoryMockProps {
  step: StoryStep['id'];
  className?: string;
}

const thread: readonly ChatMessage[] = [
  { from: 'tenant', text: 'Hi, is the 2-bed on Elm Row still free? Could I view Thursday?' },
  {
    from: 'hallway',
    text: 'Yes — available 1 March at £1,450 pcm. Quick questions first: when would you like to move, and any pets?',
  },
  { from: 'tenant', text: 'Early March, no pets. Budget up to £1,500.' },
  { from: 'hallway', text: 'Perfect. Thursday 17:30 or 18:15?' },
  { from: 'tenant', text: '18:15 please!' },
];

const visible: Record<StoryStep['id'], number> = { arrive: 2, qualify: 3, book: 5, follow: 5 };

/** Product UI mock whose state follows the active story step. Described as one image. */
export function StoryMock({ step, className }: StoryMockProps) {
  const descriptions: Record<StoryStep['id'], string> = {
    arrive: 'A new tenant message arrives at 21:42 and Hallway replies instantly.',
    qualify: 'Hallway gathers move-in date, pets and budget, and scores the lead as warm.',
    book: 'Hallway offers two diary slots and books Thursday at 18:15.',
    follow: 'The next morning the lead appears in the CRM and in the team handover.',
  };
  return (
    <div
      role="img"
      aria-label={descriptions[step]}
      className={cn('overflow-hidden rounded-lg bg-surface-2 p-3 md:p-4', className)}
    >
      <div className="rounded-md bg-surface shadow-md">
        <div className="flex items-center justify-between border-b border-line/60 px-4 py-3 text-sm">
          <span className="font-semibold">
            {step === 'follow' ? 'Morning handover' : 'Priya S. · website chat'}
          </span>
          <span className="rounded-pill bg-accent/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-accent">
            {step === 'follow' ? '08:30' : 'Live'}
          </span>
        </div>

        {step === 'follow' ? (
          <div className="grid gap-3 p-4 text-sm">
            {[
              ['chat', '47 enquiries answered overnight', 'Done'],
              ['calendar', '12 viewings booked, 3 rebooked', 'Done'],
              ['user', 'Priya S. — warm lead, synced to CRM', 'New'],
              ['wrench', 'Ceiling leak at 4 Mill Lane', 'Needs you'],
            ].map(([icon, label, status]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-sm bg-surface-2/70 px-3 py-2.5"
              >
                <Icon name={icon as 'chat'} className="text-accent" />
                <span className="flex-1">{label}</span>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    status === 'Needs you' ? 'text-danger' : 'text-ink-muted',
                  )}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-[1fr_11rem]">
            <div className="flex min-h-72 flex-col justify-end gap-3">
              {thread.slice(0, visible[step]).map((message, index) => (
                <ChatBubble key={index} message={message} />
              ))}
              {step === 'book' && (
                <ChatBubble message={{ from: 'system', text: 'Viewing booked · Thu 18:15' }} />
              )}
            </div>
            <dl className="hidden content-start gap-2 text-xs md:grid">
              {(
                [
                  ['Move-in', step === 'arrive' ? '—' : 'Early March'],
                  ['Pets', step === 'arrive' ? '—' : 'None'],
                  ['Budget', step === 'arrive' ? '—' : '£1,500'],
                  ['Score', step === 'arrive' ? 'New' : 'Warm'],
                  ['Viewing', step === 'book' ? 'Thu 18:15' : '—'],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-sm bg-surface-2/70 px-3 py-2">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
