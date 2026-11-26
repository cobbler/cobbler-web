import { expect, test } from '../fixtures/auth.fixture';

test.describe('Static informational pages', () => {
  test('an unknown path falls back to the 404 page', async ({ page }) => {
    await page.goto('/this-path-does-not-exist-e2e');
    await expect(page).toHaveURL(/\/404$/);
    await expect(
      page.getByRole('heading', { name: 'Path not found, Or unavailable.' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  // Nothing in the app currently navigates here (no guard redirects to it) - this route is
  // only reachable by a direct URL today, but it still renders real component code that a
  // regression could break silently otherwise.
  test('the unauthorized page renders and links back to login', async ({
    page,
  }) => {
    await page.goto('/unauthorized');
    await expect(
      page.getByRole('heading', {
        name: 'You are not authorized to continue.',
      }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
