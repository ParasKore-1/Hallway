import { useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export interface MarqueeProps {
  /** Items rendered once for assistive tech; a visual clone is aria-hidden. */
  children: ReactNode;
  /** Accessible name for the list region. */
  label: string;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
}

/**
 * Infinite CSS-transform marquee. Pauses on hover/focus and via an explicit toggle
 * (WCAG 2.2.2 requires a mechanism to pause moving content). Reduced motion: static wrap.
 */
export function Marquee({ children, label, duration = 40, className }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className="marquee overflow-hidden mask-x-from-90% mask-x-to-100%"
        data-paused={paused}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className="marquee-track">
          <ul aria-label={label} className="flex shrink-0 items-center">
            {children}
          </ul>
          <ul aria-hidden="true" className="marquee-clone flex shrink-0 items-center">
            {children}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setPaused((value) => !value);
        }}
        aria-pressed={paused}
        className="mt-4 ml-auto flex min-h-8 items-center gap-1.5 rounded-pill px-3 text-xs text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink motion-reduce:hidden"
      >
        <Icon name={paused ? 'play' : 'pause'} />
        {paused ? 'Play' : 'Pause'} logos
      </button>
    </div>
  );
}
