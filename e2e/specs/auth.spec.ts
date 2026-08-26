import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import {
  COBBLER_PASSWORD,
  COBBLER_USERNAME,
} from '../fixtures/backend.fixture';

// Deliberately uses the plain (unauthenticated) `base` test, not the shared auth fixture — this
// spec exercises the login/logout/guard flows themselves and must start from a clean, logged-out
// session for every test.
const test = base;

test.describe('Authentication', () => {
  test('logs in with valid credentials and reaches /manage', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(COBBLER_USERNAME, COBBLER_PASSWORD);
    await loginPage.expectLoggedIn();
  });

  test('shows an error message for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('not-a-real-user', 'wrong-password');
    await loginPage.expectError();
    await expect(page).toHaveURL(/\/login/);
  });

  test('blocks an unauthenticated direct navigation to a guarded route', async ({
    page,
  }) => {
    await page.goto('/items/distro');
    // The AuthGuard cancels the navigation outright (it doesn't redirect anywhere specific) — the
    // meaningful safety property is that the guarded page itself never renders.
    await expect(page).not.toHaveURL(/\/items\/distro/);
    await expect(
      page.getByRole('heading', { name: 'DISTROS' }),
    ).not.toBeVisible();
  });

  test('logs out and returns to a guarded state', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(COBBLER_USERNAME, COBBLER_PASSWORD);
    await loginPage.expectLoggedIn();

    await page.getByRole('button', { name: COBBLER_USERNAME }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login/);

    // Session should really be gone, not just the UI route.
    await page.goto('/items/distro');
    await expect(page).not.toHaveURL(/\/items\/distro/);
  });
});
