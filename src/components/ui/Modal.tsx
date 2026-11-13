import { AnimatePresence, m } from 'motion/react';
import { useId, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehaviour } from '@/hooks/useDialogBehaviour';
import { useIsClient } from '@/hooks/useIsClient';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { duration, easing } from '@/lib/motion';
import { Icon } from './Icon';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Visually hide the title (it still names the dialog). */
  hideTitle?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  size?: 'sm' | 'md' | 'lg';
  closeLabel?: string;
}

const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' } as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  hideTitle = false,
  initialFocusRef,
  size = 'md',
  closeLabel = 'Close dialog',
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mounted = useIsClient();

  useDialogBehaviour({ open, onClose, containerRef: panelRef, initialFocusRef });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-(--hw-z-modal) grid place-items-center p-4">
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            {...(description ? { 'aria-describedby': descId } : {})}
            tabIndex={-1}
            className={cn(
              'relative w-full rounded-lg bg-surface p-6 text-ink shadow-lg outline-none md:p-8',
              sizes[size],
            )}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduced ? duration.fast : duration.base, ease: easing.outExpo }}
          >
            <div className="flex items-start justify-between gap-6">
              <h2
                id={titleId}
                className={cn('font-display text-2xl text-balance', hideTitle && 'sr-only')}
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-pill text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <Icon name="close" label={closeLabel} />
              </button>
            </div>
            {description && (
              <p id={descId} className="mt-3 text-ink-muted">
                {description}
              </p>
            )}
            <div className="mt-6">{children}</div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
