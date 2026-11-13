export interface SkipLinkProps {
  /** id of the element to skip to (without #). */
  targetId: string;
  label: string;
}

export function SkipLink({ targetId, label }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="fixed top-3 left-3 z-[var(--hw-z-skip)] -translate-y-[200%] rounded-md bg-accent px-4 py-3 text-sm font-semibold text-on-accent shadow-md focus-visible:translate-y-0"
    >
      {label}
    </a>
  );
}
