import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { HeadingLevel } from './Heading';
import { Icon } from './Icon';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  /** Heading level wrapping each trigger, to fit the page outline. */
  headingLevel?: Exclude<HeadingLevel, 1>;
  /** Allow several panels open at once. */
  multiple?: boolean;
  defaultOpen?: readonly string[];
  className?: string;
}

/**
 * WAI-ARIA APG Accordion: heading > button[aria-expanded][aria-controls] + region.
 * ↑/↓ move between triggers, Home/End jump to first/last. Panels use `hidden`
 * so closed content stays in the DOM (find-in-page friendly via SSR) but out of the a11y tree.
 */
export function Accordion({
  items,
  headingLevel = 3,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(defaultOpen));
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const HeadingTag = `h${headingLevel}` as const;

  const toggle = (id: string) => {
    setOpen((current) => {
      const next = new Set(multiple ? current : []);
      if (current.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const target: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = target[event.key];
    if (next === undefined) return;
    event.preventDefault();
    triggers.current[next]?.focus();
  };

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id}>
            <HeadingTag className="font-sans text-base font-semibold">
              <button
                ref={(el) => {
                  triggers.current[index] = el;
                }}
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  toggle(item.id);
                }}
                onKeyDown={(event) => {
                  onKeyDown(event, index);
                }}
                className="group flex w-full items-center justify-between gap-6 rounded-xs py-6 text-left text-ink transition-colors hover:text-accent"
              >
                <span className="text-balance">{item.title}</span>
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-pill border border-ink-muted transition-[rotate,background-color] duration-(--hw-dur-base) ease-out-expo group-hover:bg-surface-2 group-aria-expanded:rotate-45"
                >
                  <Icon name="plus" />
                </span>
              </button>
            </HeadingTag>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="pb-6 text-ink-muted"
            >
              <div className="max-w-prose text-pretty">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
