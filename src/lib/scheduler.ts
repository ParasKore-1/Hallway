/**
 * Runs queued jobs one per macrotask so a page with many motion setups (each reading layout
 * for its ScrollTrigger) never forms one long main-thread task. This is what keeps Total
 * Blocking Time down on the motion-heavy home page.
 */
type Job = () => void;

const queue: Job[] = [];
let scheduled = false;
const channel = typeof MessageChannel === 'undefined' ? null : new MessageChannel();

function flushOne(): void {
  scheduled = false;
  const job = queue.shift();
  job?.();
  if (queue.length > 0) schedule();
}

function schedule(): void {
  if (scheduled) return;
  scheduled = true;
  if (channel) {
    channel.port1.onmessage = flushOne;
    channel.port2.postMessage(null);
  } else {
    setTimeout(flushOne, 0);
  }
}

/** Queue `job` to run in its own task. Returns a canceller. */
export function runInOwnTask(job: Job): () => void {
  let cancelled = false;
  queue.push(() => {
    if (!cancelled) job();
  });
  schedule();
  return () => {
    cancelled = true;
  };
}
