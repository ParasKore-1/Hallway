/**
 * Reference-counted scroll lock shared by Modal, Drawer and the mobile menu.
 * Lenis subscribes so smooth scrolling also stops while any overlay is open.
 */
let locks = 0;
const listeners = new Set<(locked: boolean) => void>();

function notify(): void {
  const locked = locks > 0;
  listeners.forEach((listener) => {
    listener(locked);
  });
}

export function lockScroll(): () => void {
  locks += 1;
  if (locks === 1) {
    document.documentElement.style.overflow = 'hidden';
    notify();
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.style.removeProperty('overflow');
      notify();
    }
  };
}

export function isScrollLocked(): boolean {
  return locks > 0;
}

export function onScrollLockChange(listener: (locked: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
