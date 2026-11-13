/**
 * First-visit preloader (≈1.15s, home only). Pure markup + CSS: it is in the static HTML and
 * shown from the very first paint by `html.is-preloading` (inline head script), animates with
 * CSS keyframes, and is lifted by the same script on a fixed timeline — so it can never be
 * held up by a slow JavaScript download. The hero reveal starts as it lifts (see lib/intro).
 * Reduced-motion users and repeat visits within the session never see it.
 */
export function Preloader() {
  return (
    <div
      aria-hidden="true"
      className="preloader fixed inset-0 z-(--hw-z-curtain) grid place-items-center bg-accent text-on-accent"
    >
      <div className="flex flex-col items-center gap-5">
        <svg viewBox="0 0 24 28" className="preloader-glyph h-14 w-auto">
          <path d="M2 27V12a10 10 0 0 1 20 0v15z" fill="currentColor" />
          <circle cx="16.5" cy="17.5" r="1.6" className="fill-brass-soft" />
        </svg>
        <span className="line-mask block">
          <span className="preloader-word block font-display text-2xl">Hallway</span>
        </span>
        <span className="preloader-rule block h-px w-40 origin-left bg-current opacity-60" />
      </div>
    </div>
  );
}
