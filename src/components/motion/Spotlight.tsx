import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Soft light that follows the pointer inside its positioned parent (a card with
 * overflow-hidden). Moves with transform only, throttled to one write per animation frame.
 * Fine pointers only; hidden for touch and reduced motion (the card is complete without it).
 */
export function Spotlight() {
  const enabled = useMediaQuery('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = ref.current;
    const host = light?.parentElement;
    if (!enabled || !light || !host) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const write = () => {
      frame = 0;
      light.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(write);
    };
    host.addEventListener('pointermove', onMove);
    return () => {
      host.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 size-[28rem] rounded-pill bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--hw-brass-soft)_45%,transparent),transparent)] opacity-0 transition-opacity duration-(--hw-dur-slow) group-hover:opacity-100"
    />
  );
}
