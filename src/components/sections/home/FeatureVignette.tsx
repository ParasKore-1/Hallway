import { Icon } from '@/components/ui/Icon';
import type { Feature } from '@/content/home';
import { cn } from '@/lib/cn';

export interface FeatureVignetteProps {
  id: Feature['id'];
}

const chip = 'rounded-sm bg-surface px-3 py-2 text-xs shadow-xs';

/**
 * Small live-looking UI fragment for each bento card. Purely illustrative: the card's heading
 * and body carry the meaning, so the vignette is hidden from assistive tech.
 */
export function FeatureVignette({ id }: FeatureVignetteProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {id === 'replies' && (
        <div className="flex flex-col gap-2.5">
          <div className={cn(chip, 'max-w-[85%] self-start')}>Are pets allowed at Castle St?</div>
          <div className="max-w-[85%] self-end rounded-sm bg-accent px-3 py-2 text-xs text-on-accent">
            One cat is fine — there’s an extra £150 deposit. Want to view this week?
          </div>
          <div className="flex items-center gap-1 self-end rounded-sm bg-accent/15 px-3 py-2.5">
            <span className="typing-dot size-1.5 rounded-pill bg-accent" />
            <span className="typing-dot size-1.5 rounded-pill bg-accent [animation-delay:150ms]" />
            <span className="typing-dot size-1.5 rounded-pill bg-accent [animation-delay:300ms]" />
          </div>
        </div>
      )}
      {id === 'viewings' && (
        <div className="grid grid-cols-4 gap-1.5 text-center text-[0.6875rem]">
          {['Mon', 'Tue', 'Wed', 'Thu'].map((day) => (
            <span key={day} className="font-semibold text-ink-muted">
              {day}
            </span>
          ))}
          {['09:30', '—', '12:00', '17:30', '—', '14:15', '—', '18:15'].map((slot, i) => (
            <span
              key={`${slot}-${i}`}
              className={cn(
                'rounded-xs py-1.5',
                slot === '18:15' ? 'bg-accent font-semibold text-on-accent' : 'bg-surface',
                slot === '—' && 'text-line',
              )}
            >
              {slot}
            </span>
          ))}
        </div>
      )}
      {id === 'maintenance' && (
        <ul className="space-y-1.5 text-xs">
          {[
            ['Ceiling leak', 'Emergency', 'text-danger'],
            ['Loose banister', 'This week', 'text-brass'],
            ['Dripping tap', 'Routine', 'text-ink-muted'],
          ].map(([job, priority, tone]) => (
            <li key={job} className={cn(chip, 'flex items-center justify-between gap-3')}>
              <span>{job}</span>
              <span className={cn('font-semibold', tone)}>{priority}</span>
            </li>
          ))}
        </ul>
      )}
      {id === 'rent' && (
        <ol className="relative space-y-2 border-l border-ink-muted/40 pl-4 text-xs">
          {[
            ['−3 days', 'Friendly heads-up'],
            ['Due', 'Payment link sent'],
            ['+2 days', 'Gentle reminder'],
          ].map(([when, what], i) => (
            <li key={when} className="relative">
              <span
                className={cn(
                  'absolute top-1 -left-[1.3rem] size-2 rounded-pill',
                  i === 2 ? 'bg-brass' : 'bg-accent',
                )}
              />
              <span className="font-semibold">{when}</span> · {what}
            </li>
          ))}
        </ol>
      )}
      {id === 'approval' && (
        <div className={cn(chip, 'flex items-center justify-between gap-3')}>
          <span>Arrears reply drafted</span>
          <span className="flex gap-1.5">
            <span className="rounded-xs bg-surface-2 px-2 py-1 font-semibold">Edit</span>
            <span className="rounded-xs bg-accent px-2 py-1 font-semibold text-on-accent">
              Approve
            </span>
          </span>
        </div>
      )}
      {id === 'handover' && (
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ['chat', '47', 'enquiries answered'],
            ['calendar', '12', 'viewings booked'],
            ['wrench', '3', 'need you today'],
          ].map(([icon, n, label]) => (
            <div key={label} className={cn(chip, 'flex items-center gap-3')}>
              <Icon name={icon as 'chat' | 'calendar' | 'wrench'} className="text-accent" />
              <span>
                <span className="block font-display text-lg leading-none">{n}</span>
                <span className="text-ink-muted">{label}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
