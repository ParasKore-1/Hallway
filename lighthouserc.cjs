/**
 * Lighthouse CI — budgets from CONTRIBUTING.md. Runs mobile emulation (Lighthouse default:
 * Moto G Power, simulated slow 4G, 4× CPU slowdown) against the prerendered production build.
 * The build fails if any assertion misses.
 */
const pages = ['/', '/product', '/pricing', '/about'];

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview --port 4173 --strictPort',
      startServerReadyPattern: 'Local',
      url: pages.map((p) => `http://localhost:4173${p}`),
      numberOfRuns: process.env.CI ? 3 : 1,
      settings: {
        // Reruns in the same session would skip the first-visit preloader; LHCI uses a fresh
        // profile per run so every run measures the true first visit (worst case).
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      // Judge the median run, not LHCI's default "optimistic" (best-of-N) aggregation.
      aggregationMethod: 'median-run',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        // INP needs real interaction; TBT is Lighthouse's lab proxy for it.
        // Warn-level: TBT is a load-time lab metric, not INP. Interaction latency (INP) is
        // measured separately with the Event Timing API — see build/perf-profile.ts.
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:font:size': ['warn', { maxNumericValue: 160000 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
