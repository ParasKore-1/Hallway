import { AnimatePresence, m } from 'motion/react';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, easing } from '@/lib/motion';
import { Toast } from './Toast';
import {
  ToastContext,
  type ToastContextValue,
  type ToastOptions,
  type ToastRecord,
} from './toastContext';

export interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Renders a persistent polite live region (present from first paint so announcements are
 * reliably picked up) and stacks toasts in it, newest at the bottom.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);
  const reduced = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const record: ToastRecord = {
      id,
      title: options.title,
      tone: options.tone ?? 'neutral',
      duration: options.duration ?? 5000,
      ...(options.description ? { description: options.description } : {}),
    };
    setToasts((list) => [...list.slice(-2), record]);
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-(--hw-z-toast) flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <m.div
              key={t.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: duration.base, ease: easing.outExpo }}
              className="pointer-events-auto w-full sm:w-96"
            >
              <Toast record={t} onDismiss={dismiss} />
            </m.div>
          ))}
        </AnimatePresence>
      </section>
    </ToastContext.Provider>
  );
}
