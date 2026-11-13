/**
 * First-load intro coordination.
 *
 * The inline script in index.html owns the preloader timeline so it never depends on JS
 * download speed: on a first visit it adds `html.is-preloading`, then at
 *   INTRO_READY_MS  → adds `is-preloader-leaving` and dispatches the ready event,
 *   INTRO_DONE_MS   → removes both classes and sets the sessionStorage flag.
 * Keep these numbers in sync with the script.
 */
export const VISITED_KEY = 'hallway-visited';
export const READY_EVENT = 'hallway:intro-ready';
export const INTRO_READY_MS = 850;
export const INTRO_DONE_MS = 1150;

/** True while the preloader still fully covers the page. */
export function isPreloading(): boolean {
  const classes = document.documentElement.classList;
  return classes.contains('is-preloading') && !classes.contains('is-preloader-leaving');
}

/** Runs `callback` when the intro cover lifts (immediately if there is none). */
export function onIntroReady(callback: () => void): () => void {
  if (!isPreloading()) {
    callback();
    return () => undefined;
  }
  window.addEventListener(READY_EVENT, callback, { once: true });
  return () => {
    window.removeEventListener(READY_EVENT, callback);
  };
}

let clientNavigated = false;

/** Called by RouteTransition when a client-side navigation starts. */
export function markClientNavigation(): void {
  clientNavigated = true;
}

/**
 * True when the current page is (or is about to be) covered — by the first-visit preloader or
 * by the route curtain — so entrance animations may start from a hidden state without a flash.
 */
export function isCovered(): boolean {
  return isPreloading() || clientNavigated;
}
