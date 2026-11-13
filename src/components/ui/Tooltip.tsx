import { Slot } from '@radix-ui/react-slot';
import { useEffect, useId, useRef, useState, type ReactElement } from 'react';
import { cn } from '@/lib/cn';

export interface TooltipProps {
  /** Supplementary text only — never put essential information in a tooltip. */
  content: string;
  /** A single focusable element. */
  children: ReactElement;
  side?: 'top' | 'bottom';
  delay?: number;
}

/**
 * Hover/focus tooltip meeting WCAG 1.4.13: dismissible (Esc), hoverable (pointer can move
 * onto it), persistent (stays until hover/focus leaves). Linked via aria-describedby.
 */
export function Tooltip({ content, children, side = 'top', delay = 150 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(true);
    }, delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  return (
    <span className="relative inline-flex" onPointerEnter={show} onPointerLeave={hide}>
      <Slot aria-describedby={id} onFocus={show} onBlur={hide}>
        {children}
      </Slot>
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-auto absolute left-1/2 z-(--hw-z-raised) w-max max-w-64 -translate-x-1/2 rounded-sm bg-ink px-3 py-2 text-xs text-bg shadow-md transition-[opacity,translate] duration-(--hw-dur-fast) ease-standard',
          side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0',
        )}
      >
        {content}
      </span>
    </span>
  );
}
