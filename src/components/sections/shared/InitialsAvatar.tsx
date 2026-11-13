import { cn } from '@/lib/cn';
import { initialsOf } from '@/lib/initials';

export interface InitialsAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'size-7 text-[0.625rem]',
  md: 'size-10 text-xs',
  lg: 'size-14 text-sm',
} as const;
const tones = [
  'bg-accent text-on-accent',
  'bg-brass-soft text-ink',
  'bg-ink text-bg',
  'bg-surface-2 text-ink',
];

/** Decorative initials avatar; the person's name is always present as text nearby. */
export function InitialsAvatar({ name, size = 'md', className }: InitialsAvatarProps) {
  const tone = tones[name.length % tones.length] ?? tones[0];
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-pill font-semibold',
        sizes[size],
        tone,
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
