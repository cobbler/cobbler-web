import { expect, test } from '../fixtures/auth.fixture';

// Read-only coverage: `allow_dynamic_settings` is false by default, so the inline-edit path isn't
// exercised here (would need a CI backend config change with broader blast radius than item CRUD).
test.describe('Settings', () => {
  test('renders the settings table with real backend data', async ({
    page,
  }) => {
    await page.goto('/settings');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Name' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Value' }),
    ).toBeVisible();
    // Real backend data, not a static placeholder — a known setting from a fresh settings.yaml,
    // paginated so we can't assume any single row is on the first page without filtering.
    await expect(
      page.getByRole('row', { name: /^allow_duplicate_hostnames/ }),
    ).toBeVisible();
  });

  test('filter narrows the visible rows', async ({ page }) => {
    await page.goto('/settings');
    const filter = page.getByPlaceholder('Ex. auto_migrate_settings');
    // The filter listens for (keyup); `.fill()` doesn't dispatch keyboard events, so type instead.
    await filter.pressSequentially('server');
    await expect(page.getByRole('row', { name: /^server/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /^manage_dhcp/ })).toHaveCount(
      0,
    );
  });
});
