import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import {
  COBBLER_PASSWORD,
  COBBLER_USERNAME,
} from '../fixtures/backend.fixture';

// The navbar's displayed username/profile-menu state lives only in the in-memory UserService,
// populated solely by a real login submit - not restored from the shared auth fixture's cached
// storageState (which only seeds the token AuthGuard checks, not this UI state). A real UI login
// is required to reach the profile menu, same as auth.spec.ts.
const test = base;

test.describe('Preferences', () => {
  test('toggling dark mode applies it immediately and persists it across a reload', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(COBBLER_USERNAME, COBBLER_PASSWORD);
    await loginPage.expectLoggedIn();

    await page.getByRole('button', { name: COBBLER_USERNAME }).click();
    await page.getByRole('menuitem', { name: 'Preferences' }).click();
    await expect(page).toHaveURL(
      new RegExp(`/user/${COBBLER_USERNAME}/preferences`),
    );
    await expect(
      page.getByRole('heading', { name: 'User Preferences' }),
    ).toBeVisible();

    const darkModeToggle = page.getByRole('switch', { name: 'Dark Mode' });
    await expect(page.locator('body')).not.toHaveClass(/dark-theme/);

    await darkModeToggle.click();
    await expect(page.locator('body')).toHaveClass(/dark-theme/);

    // The preference is only re-applied by this component's own ngOnInit, not by anything
    // app-wide - reload and come back to this same page to confirm it was actually persisted
    // (e.g. to localStorage), not just a transient in-memory toggle.
    await page.reload();
    await expect(
      page.getByRole('switch', { name: 'Dark Mode' }),
    ).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('body')).toHaveClass(/dark-theme/);
  });
});
