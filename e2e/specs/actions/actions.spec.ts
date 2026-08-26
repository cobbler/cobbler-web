import { Page, expect } from '@playwright/test';
import { test } from '../../fixtures/auth.fixture';

/**
 * All 10 action-trigger pages, against the real backend. Per scoping: assert a real, non-crashed
 * response was produced (no uncaught JS exception) — NOT that the underlying operation fully
 * succeeded. buildiso/hardlink/mkloaders/replicate are hardware/filesystem/remote-master-dependent
 * and may legitimately end in a real backend error surfaced via a snackbar; that's an acceptable,
 * honest outcome here, as long as the app doesn't crash.
 */
interface ActionCase {
  label: string;
  route: string;
  run: (page: Page) => Promise<void>;
}

const ACTIONS: ActionCase[] = [
  {
    label: 'sync',
    route: '/actions/sync',
    run: async (page) => {
      await page.getByRole('button', { name: 'Sync' }).first().click();
    },
  },
  {
    label: 'reposync',
    route: '/actions/reposync',
    run: async (page) => {
      await page.getByRole('button', { name: 'Run' }).click();
    },
  },
  {
    label: 'check',
    route: '/actions/check',
    run: async (page) => {
      await expect(page.getByRole('heading', { name: 'CHECK' })).toBeVisible();
    },
  },
  {
    label: 'status',
    route: '/actions/status',
    run: async (page) => {
      await expect(page.getByRole('table')).toBeVisible();
    },
  },
  {
    label: 'hardlink',
    route: '/actions/hardlink',
    run: async (page) => {
      await page.getByRole('button', { name: 'Hardlink' }).click();
    },
  },
  {
    label: 'mkloaders',
    route: '/actions/mkloaders',
    run: async (page) => {
      await page.getByRole('button', { name: 'Mkloaders' }).click();
    },
  },
  {
    label: 'validate-autoinstalls',
    route: '/actions/validate-autoinstalls',
    run: async (page) => {
      await page.getByRole('button', { name: 'Run' }).click();
    },
  },
  {
    label: 'replicate',
    route: '/actions/replicate',
    run: async (page) => {
      await page
        .locator('[formcontrolname="master"]')
        .fill('unreachable-master.invalid');
      await page.getByRole('button', { name: 'Run' }).click();
    },
  },
  {
    label: 'import',
    route: '/actions/import',
    run: async (page) => {
      await page
        .locator('[formcontrolname="path"]')
        .fill('/nonexistent/e2e-path');
      await page.locator('[formcontrolname="name"]').fill('e2e-import-name');
      await page.getByRole('button', { name: 'Run' }).click();
    },
  },
  {
    label: 'buildiso',
    route: '/actions/buildiso',
    run: async (page) => {
      await page
        .locator('[formcontrolname="distro"]')
        .fill('nonexistent-e2e-distro');
      await page.getByRole('button', { name: 'Run' }).click();
    },
  },
];

test.describe('Action pages', () => {
  for (const action of ACTIONS) {
    test(`${action.label} submits without crashing`, async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (error) => pageErrors.push(error));

      await page.goto(action.route);
      await action.run(page);
      // Give the XML-RPC round-trip (success or error snackbar) a moment to settle.
      await page.waitForTimeout(1000);

      expect(
        pageErrors,
        `Uncaught page errors: ${pageErrors.map((e) => e.message).join('; ')}`,
      ).toHaveLength(0);
    });
  }
});
