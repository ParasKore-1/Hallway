import { ChatBubble } from '@/components/sections/shared/ChatBubble';
import { InitialsAvatar } from '@/components/sections/shared/InitialsAvatar';
import { Icon } from '@/components/ui/Icon';
import { mockInbox } from '@/content/home';
import { cn } from '@/lib/cn';

export interface InboxMockProps {
  className?: string;
}

/**
 * An original HTML/CSS mock of the Hallway inbox. Exposed to assistive tech as a single
 * image with a description, so its sample text isn't read as page content.
 */
export function InboxMock({ className }: InboxMockProps) {
  return (
    <div
      role="img"
      aria-label="The Hallway inbox: a tenant asks to view a flat on Thursday, Hallway offers two times and books the viewing automatically."
      className={cn(
        'grid min-h-[26rem] grid-rows-[auto_1fr] overflow-hidden rounded-md bg-surface text-left text-ink shadow-lg md:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_16rem]',
        className,
      )}
    >
      {/* Top bar */}
      <div className="col-span-full flex items-center gap-3 border-b border-line/70 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-pill bg-line" />
          <span className="size-2.5 rounded-pill bg-line" />
          <span className="size-2.5 rounded-pill bg-line" />
        </span>
        <span className="ml-2 text-sm font-semibold">{mockInbox.title}</span>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-accent">
          <span className="size-1.5 rounded-pill bg-current" />
          {mockInbox.live}
        </span>
        <span className="ml-auto flex items-center gap-2 text-ink-muted">
          <Icon name="bell" />
          <InitialsAvatar name="Sam Agent" size="sm" />
        </span>
      </div>

      {/* Conversation list */}
      <ul className="hidden border-r border-line/70 md:block">
        {mockInbox.conversations.map((c, index) => (
          <li
            key={c.id}
            className={cn(
              'flex gap-3 border-b border-line/50 px-4 py-3',
              index === 0 && 'bg-surface-2/70',
            )}
          >
            <InitialsAvatar name={c.name} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[0.8125rem] font-semibold">{c.name}</span>
                <span className="text-[0.6875rem] text-ink-muted">{c.time}</span>
              </span>
              <span className="block truncate text-xs text-ink-muted">{c.preview}</span>
              <span className="mt-1 inline-block rounded-xs bg-surface-2 px-1.5 text-[0.625rem] font-semibold text-ink-muted">
                {c.tag}
              </span>
            </span>
            {c.unread && <span className="mt-1.5 size-2 rounded-pill bg-brass" />}
          </li>
        ))}
      </ul>

      {/* Thread */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3 border-b border-line/50 px-4 py-3">
          <InitialsAvatar name="Priya S." size="sm" />
          <span className="text-[0.8125rem] font-semibold">Priya S.</span>
          <span className="text-xs text-ink-muted">via website chat</span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-3 p-4">
          {mockInbox.thread.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              {...(index >= 2 ? { className: 'hero-bubble' } : {})}
            />
          ))}
        </div>
        <div className="m-3 mt-0 flex items-center gap-2 rounded-pill border border-line/70 px-4 py-2 text-xs text-ink-muted">
          <Icon name="sparkle" className="text-brass" />
          <span className="truncate">{mockInbox.composer}</span>
          <span className="ml-auto grid size-7 shrink-0 place-items-center rounded-pill bg-accent text-on-accent">
            <Icon name="send" />
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="hidden border-l border-line/70 p-4 xl:block">
        <p className="text-xs font-semibold tracking-eyebrow text-ink-muted uppercase">
          {mockInbox.details.title}
        </p>
        <dl className="mt-3 space-y-3">
          {mockInbox.details.rows.map(([label, value]) => (
            <div key={label} className="rounded-sm bg-surface-2/70 px-3 py-2">
              <dt className="text-[0.6875rem] text-ink-muted">{label}</dt>
              <dd className="text-[0.8125rem] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 rounded-sm border border-accent/30 p-3 text-xs">
          <p className="font-semibold text-accent">Next step</p>
          <p className="mt-1 text-ink-muted">Send referencing checklist after viewing.</p>
        </div>
      </div>
    </div>
  );
}
