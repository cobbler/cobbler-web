import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * This suite runs against a REAL Cobbler backend (see e2e/fixtures/backend.fixture.ts), not a
 * mocked one — tests mutate real backend state using a unique `e2e-*` naming convention
 * (e2e/fixtures/naming.ts) to stay collision-free under parallel workers, and both a per-test
 * best-effort cleanup and this config's `globalTeardown` sweep any leftovers.
 */
export default defineConfig({
  testDir: './e2e/specs',
  globalTeardown: './e2e/global-teardown.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  // Real-backend XML-RPC round-trips are slower and slightly less deterministically timed than a
  // mocked backend — one retry in CI absorbs transient timing flakiness without masking real bugs.
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI']
    ? [['github'], ['html', { open: 'never' }]]
    : 'html',
  // The dev/CI backend is a single-threaded Python BaseHTTPServer — concurrent workers queue
  // requests rather than racing on data, but that queueing can itself exceed default timeouts.
  expect: { timeout: 15000 },
  use: {
    baseURL: process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? 'http://localhost:4200',
    actionTimeout: 15000,
    trace: 'on-first-retry',
  },

  projects: [
    {
      // Item CRUD / auth / settings specs: independent, uniquely-named objects, safe to run
      // fully in parallel against the shared backend.
      name: 'items',
      testIgnore: '**/actions/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Action-trigger specs (sync/check/status/etc.) operate over ALL existing items, not a
      // named one — run serially (single spec file, fullyParallel: false keeps its tests in
      // execution order within one worker) and only after the item-CRUD project has finished,
      // so they don't race concurrently-mutating item tests.
      name: 'actions',
      testMatch: '**/actions/**',
      fullyParallel: false,
      dependencies: ['items'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
