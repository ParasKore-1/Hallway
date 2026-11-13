import { AnimatePresence, m } from 'motion/react';
import { useId, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehaviour } from '@/hooks/useDialogBehaviour';
import { useIsClient } from '@/hooks/useIsClient';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { duration, easing } from '@/lib/motion';
import { Icon } from './Icon';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  hideTitle?: boolean;
  side?: 'right' | 'left' | 'bottom';
  children?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeLabel?: string;
  /** Extra classes for the panel (e.g. full-width mobile menu). */
  panelClassName?: string;
  id?: string;
}

const offscreen = {
  right: { x: '100%' },
  left: { x: '-100%' },
  bottom: { y: '100%' },
} as const;

const placement = {
  right: 'inset-y-0 right-0 w-full max-w-md',
  left: 'inset-y-0 left-0 w-full max-w-md',
  bottom: 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-lg',
} as const;

export function Drawer({
  open,
  onClose,
  title,
  hideTitle = false,
  side = 'right',
  children,
  initialFocusRef,
  closeLabel = 'Close',
  panelClassName,
  id,
}: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mounted = useIsClient();

  useDialogBehaviour({ open, onClose, containerRef: panelRef, initialFocusRef });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-(--hw-z-modal)">
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          />
          <m.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              'absolute flex flex-col overflow-y-auto bg-bg text-ink shadow-lg outline-none',
              placement[side],
              panelClassName,
            )}
            initial={reduced ? { opacity: 0 } : offscreen[side]}
            animate={reduced ? { opacity: 1 } : { x: 0, y: 0 }}
            exit={reduced ? { opacity: 0 } : offscreen[side]}
            transition={{
              duration: reduced ? duration.fast : duration.slow,
              ease: easing.inOutQuart,
            }}
          >
            <div className="flex items-center justify-between gap-4 px-gutter pt-5">
              <h2 id={titleId} className={cn('font-display text-xl', hideTitle && 'sr-only')}>
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto grid size-11 place-items-center rounded-pill text-ink transition-colors hover:bg-surface-2"
              >
                <Icon name="close" label={closeLabel} />
              </button>
            </div>
            <div className="flex-1 px-gutter pt-4 pb-8">{children}</div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
