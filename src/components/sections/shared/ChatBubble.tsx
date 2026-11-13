import type { ChatMessage } from '@/content/home';
import { cn } from '@/lib/cn';

export interface ChatBubbleProps {
  message: ChatMessage;
  className?: string;
}

/** A single message in a UI mock. Tenant left, Hallway right, system events centred. */
export function ChatBubble({ message, className }: ChatBubbleProps) {
  if (message.from === 'system') {
    return (
      <div
        className={cn(
          'mx-auto flex w-fit items-center gap-2 rounded-pill border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent',
          className,
        )}
      >
        <span className="size-1.5 rounded-pill bg-current" />
        {message.text}
      </div>
    );
  }
  const isTenant = message.from === 'tenant';
  return (
    <div className={cn('flex flex-col gap-1', isTenant ? 'items-start' : 'items-end', className)}>
      <div
        className={cn(
          'max-w-[85%] rounded-md px-3.5 py-2.5 text-[0.8125rem] leading-snug',
          isTenant
            ? 'rounded-bl-xs bg-surface-2 text-ink'
            : 'rounded-br-xs bg-accent text-on-accent',
        )}
      >
        {message.text}
      </div>
      {message.time && (
        <span className="px-1 text-[0.6875rem] text-ink-muted">
          {isTenant ? 'Tenant' : 'Hallway'} · {message.time}
        </span>
      )}
    </div>
  );
}
