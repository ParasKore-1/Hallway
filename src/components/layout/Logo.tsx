import { cn } from '@/lib/cn';

export interface LogoProps {
  className?: string;
}

/** Hallway wordmark: an arched doorway glyph + set name. Decorative; parent link names it. */
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-ink', className)}>
      <svg viewBox="0 0 24 28" aria-hidden="true" focusable="false" className="h-[1.3em] w-auto">
        <path d="M2 27V12a10 10 0 0 1 20 0v15z" className="fill-accent" />
        <circle cx="16.5" cy="17.5" r="1.6" className="fill-brass-soft" />
      </svg>
      <span className="font-display text-xl leading-none font-[460] tracking-tight">Hallway</span>
    </span>
  );
}
