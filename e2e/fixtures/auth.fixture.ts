import { BrowserContext, test as base, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import {
  COBBLER_PASSWORD,
  COBBLER_USERNAME,
  createBackendClient,
} from './backend.fixture';
import { CobblerXmlRpcClient } from './xmlrpc-client';

// Kept in sync with playwright.config.ts's own fallback, since a worker-scoped fixture can't
// depend on the (test-scoped) `baseURL` option.
const BASE_URL =
  process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? 'http://localhost:4200';

interface Fixtures {
  backend: CobblerXmlRpcClient;
}

interface WorkerFixtures {
  // Logs in via the real UI once per worker; every test's `storageState` (below) reuses it,
  // instead of every test paying for a full UI login.
  authState: Awaited<ReturnType<BrowserContext['storageState']>>;
}

export const test = base.extend<Fixtures, WorkerFixtures>({
  authState: [
    async ({ browser }, use) => {
      const context = await browser.newContext({ baseURL: BASE_URL });
      const page = await context.newPage();
      await page.goto('/login');
      const loginPage = new LoginPage(page);
      await loginPage.login(COBBLER_USERNAME, COBBLER_PASSWORD);
      await loginPage.expectLoggedIn();
      const state = await context.storageState();
      await context.close();
      await use(state);
    },
    { scope: 'worker' },
  ],

  // Overrides Playwright's built-in `storageState` test option with the cached worker-scoped
  // session above, so every test's default `page`/`context` fixture starts already logged in.
  storageState: async ({ authState }, use) => {
    await use(authState);
  },

  backend: async ({}, use) => {
    const client = await createBackendClient();
    await use(client);
  },
});

export { expect };
