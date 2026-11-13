/**
 * Runtime performance profile (needs `pnpm preview` on :4173).
 *
 * 1. Scroll smoothness — desktop, full motion (Lenis + ScrollTrigger + pinned section):
 *    wheel-scrolls the whole home page while recording every animation frame's duration and
 *    every long task (> 50 ms) via PerformanceObserver.
 * 2. Interaction latency (INP proxy) — 375px viewport with 4× CPU throttling (CDP), using the
 *    Event Timing API (`event` entries, durationThreshold 16) for real taps: mobile menu,
 *    FAQ accordion, demo tabs, pricing toggle. INP ≈ the worst interaction.
 */
import { chromium, type Page } from '@playwright/test';

const BASE = 'http://localhost:4173';

async function skipPreloader(page: Page) {
  // tsx/esbuild wraps named functions with a `__name` helper; provide it in the page too.
  await page.addInitScript('window.__name = (fn) => fn;');
  await page.addInitScript(() => {
    sessionStorage.setItem('hallway-visited', '1');
  });
}

const browser = await chromium.launch();

// ---------- 1 · Scroll profile ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await skipPreloader(page);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.mouse.move(700, 450);
  await page.evaluate(() => {
    const w = window as unknown as { __frames: number[]; __long: number[] };
    w.__frames = [];
    w.__long = [];
    let last = performance.now();
    const loop = (t: number) => {
      w.__frames.push(t - last);
      last = t;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) w.__long.push(e.duration);
    }).observe({ type: 'longtask', buffered: false });
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.ceil((height + 3000) / 120);
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(1200);
  const { frames, long } = await page.evaluate(() => {
    const w = window as unknown as { __frames: number[]; __long: number[] };
    return { frames: w.__frames.slice(1), long: w.__long };
  });
  const sorted = [...frames].sort((a, b) => a - b);
  const pct = (p: number) =>
    sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? 0;
  const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
  const dropped = frames.filter((f) => f > (1000 / 60) * 1.5).length;
  console.log('Scroll profile (desktop, full motion, Lenis + pin)');
  console.log(
    `  frames: ${frames.length}, avg ${avg.toFixed(1)} ms → ${(1000 / avg).toFixed(0)} fps`,
  );
  console.log(
    `  p50 ${pct(0.5).toFixed(1)} ms, p95 ${pct(0.95).toFixed(1)} ms, p99 ${pct(0.99).toFixed(1)} ms`,
  );
  console.log(`  frames > 25 ms: ${dropped} (${((dropped / frames.length) * 100).toFixed(1)}%)`);
  console.log(
    `  long tasks during scroll: ${long.length}${long.length ? ` (max ${Math.max(...long).toFixed(0)} ms)` : ''}`,
  );
  await page.close();
}

// ---------- 2 · Interaction latency ----------
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 800 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await skipPreloader(page);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const observe = () =>
    page.evaluate(() => {
      const w = window as unknown as { __events: { name: string; duration: number }[] };
      w.__events = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          // `interactionId` (Event Timing Level 2) is not in TypeScript's DOM lib yet.
          const ev = e as PerformanceEventTiming & { interactionId?: number };
          if (ev.interactionId) w.__events.push({ name: ev.name, duration: ev.duration });
        }
      }).observe({
        type: 'event',
        durationThreshold: 16,
        buffered: true,
      } as PerformanceObserverInit);
    });
  const worst = async (label: string) => {
    await page.waitForTimeout(600);
    const events = await page.evaluate(
      () => (window as unknown as { __events: { name: string; duration: number }[] }).__events,
    );
    const max = events.reduce((m, e) => Math.max(m, e.duration), 0);
    console.log(`  ${label.padEnd(34)} ${max ? `${Math.round(max)} ms` : '< 16 ms'}`);
    return max;
  };

  console.log('Interaction latency (375px, 4× CPU throttle, Event Timing API)');
  const results: number[] = [];

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await observe();
  await page.getByRole('button', { name: 'Open menu' }).click();
  results.push(await worst('Open mobile menu'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);

  await observe();
  const tab = page.getByRole('tab', { name: 'Viewings' });
  await tab.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await observe();
  await tab.click();
  results.push(await worst('Switch demo tab'));

  const faq = page.getByRole('button', { name: 'Does Hallway replace my negotiators?' });
  await faq.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await observe();
  await faq.click();
  results.push(await worst('Open FAQ item'));

  await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' });
  await observe();
  await page.locator('label', { hasText: 'Annual' }).click();
  results.push(await worst('Pricing monthly → annual'));

  console.log(`  ⇒ worst interaction (INP proxy): ${Math.round(Math.max(...results))} ms`);
  await context.close();
}

await browser.close();
