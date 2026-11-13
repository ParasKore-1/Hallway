import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { gsapEase, withGsap } from '@/lib/gsap';

const MAGNET_STRENGTH = 0.3;

/**
 * Decorative follower ring for fine pointers, plus magnetic pull on [data-magnetic] elements
 * and a text label over [data-cursor-label] regions. The native cursor is never hidden, so
 * nothing about pointing or clicking depends on this element. Off for touch and reduced motion.
 */
export function Cursor() {
  const enabled = useMediaQuery('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  return enabled ? <CursorFollower /> : null;
}

function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    let teardown: (() => void) | undefined;
    const cancel = withGsap(({ gsap }) => {
      gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });
      const moveX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
      const moveY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

      let magnet: HTMLElement | null = null;
      let currentLabel = '';
      let frame = 0;
      let last: PointerEvent | null = null;

      const releaseMagnet = () => {
        if (!magnet) return;
        gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: gsapEase.emphasized });
        magnet = null;
      };

      const update = () => {
        frame = 0;
        const event = last;
        if (!event) return;
        moveX(event.clientX);
        moveY(event.clientY);

        const target = event.target instanceof Element ? event.target : null;
        const nextMagnet = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
        if (nextMagnet !== magnet) releaseMagnet();
        if (nextMagnet) {
          magnet = nextMagnet;
          const rect = nextMagnet.getBoundingClientRect();
          gsap.to(nextMagnet, {
            x: (event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH,
            y: (event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH,
            duration: 0.4,
            ease: 'power3.out',
          });
        }

        const labelHost = target?.closest<HTMLElement>('[data-cursor-label]');
        const nextLabel = labelHost?.dataset.cursorLabel ?? '';
        const interactive = Boolean(target?.closest('a, button, [role="tab"], summary, label'));
        if (nextLabel !== currentLabel) {
          currentLabel = nextLabel;
          setLabel(nextLabel);
        }
        gsap.to(ring, {
          scale: nextLabel ? 2.6 : interactive ? 1.6 : 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        last = event;
        if (!frame) frame = requestAnimationFrame(update);
      };
      const onLeave = () => {
        releaseMagnet();
        gsap.to(ring, { opacity: 0, duration: 0.2 });
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      teardown = () => {
        cancelAnimationFrame(frame);
        releaseMagnet();
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        gsap.killTweensOf(ring);
      };
    });
    return () => {
      cancel();
      teardown?.();
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-(--hw-z-toast) grid size-8 place-items-center rounded-pill border border-ink/40 transition-colors ${label ? 'bg-brass-soft/90' : ''}`}
    >
      <span className="text-[0.375rem] font-semibold tracking-wide text-ink uppercase">
        {label}
      </span>
    </div>
  );
}
