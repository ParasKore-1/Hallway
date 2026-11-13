import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import type { ToastRecord } from './toastContext';

export interface ToastProps {
  record: ToastRecord;
  onDismiss: (id: number) => void;
}

const toneIcon = { neutral: 'info', success: 'check', danger: 'info' } as const;
const toneClass = {
  neutral: 'text-accent',
  success: 'text-success',
  danger: 'text-danger',
} as const;

export function Toast({ record, onDismiss }: ToastProps) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(record.duration);
  const startedAt = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  // Pause auto-dismiss while the pointer or focus is on the toast (WCAG 2.2.1).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pause = () => {
      setPaused(true);
    };
    const resume = () => {
      setPaused(false);
    };
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
    return () => {
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerleave', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => {
      onDismiss(record.id);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, onDismiss, record.id]);

  return (
    <div
      ref={ref}
      role="status"
      className="flex items-start gap-3 rounded-md border border-line bg-surface p-4 text-sm text-ink shadow-lg"
    >
      <Icon name={toneIcon[record.tone]} className={cn('mt-0.5', toneClass[record.tone])} />
      <div className="flex-1">
        <p className="font-semibold">{record.title}</p>
        {record.description && <p className="mt-1 text-ink-muted">{record.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => {
          onDismiss(record.id);
        }}
        className="-m-1 grid size-8 place-items-center rounded-pill text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <Icon name="close" label="Dismiss notification" />
      </button>
    </div>
  );
}
