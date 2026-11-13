import { useEffect, useRef, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { getFocusable } from '@/lib/focusable';
import { lockScroll } from '@/lib/scrollLock';

export interface DialogBehaviourOptions {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  /** Element to focus on open; defaults to the first focusable, then the container. */
  initialFocusRef?: RefObject<HTMLElement | null> | undefined;
}

/**
 * Modal semantics shared by Modal, Drawer and the mobile menu:
 * - focus moves in on open and is trapped (Tab / Shift+Tab cycle)
 * - Esc closes
 * - page scroll (and Lenis) locked
 * - the app root is made `inert` so AT and pointer can't reach the background
 * - focus returns to the element that opened it
 */
export function useDialogBehaviour({
  open,
  onClose,
  containerRef,
  initialFocusRef,
}: DialogBehaviourOptions): void {
  const onCloseRef = useRef(onClose);
  useIsomorphicLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockScroll();
    const appRoot = document.getElementById('root');
    const rootWasInert = appRoot?.inert ?? false;
    if (appRoot && !appRoot.contains(container)) appRoot.inert = true;

    const target = initialFocusRef?.current ?? getFocusable(container)[0] ?? container;
    target.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable(container);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        container.focus();
        return;
      }
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (appRoot) appRoot.inert = rootWasInert;
      unlock();
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, containerRef, initialFocusRef]);
}
