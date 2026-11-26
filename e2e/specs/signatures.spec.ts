import { test, expect } from '../fixtures/auth.fixture';

// Breed/OS-version/attribute names below come from the signatures data baked into the
// v4.0.0b11 backend image (libcobblersignatures' distro_signatures.json) - real, stable
// backend content, not fixtures this suite controls.

test.describe('Signatures', () => {
  test('renders the signature tree and expands down to a real attribute value', async ({
    page,
  }) => {
    await page.goto('/signatures');

    await page.getByLabel('Toggle redhat').click();
    await expect(page.getByLabel('Toggle rhel8')).toBeVisible();

    await page.getByLabel('Toggle rhel8').click();
    await expect(page.getByRole('cell', { name: 'kernel_file' })).toBeVisible();
    await expect(page.getByRole('row', { name: /kernel_file/ })).toContainText(
      'vmlinuz(.*)',
    );
  });

  test('filtering by breed narrows the tree, and clearing resets it', async ({
    page,
  }) => {
    await page.goto('/signatures');
    await expect(page.getByLabel('Toggle redhat')).toBeVisible();

    await page.getByLabel('Search for OS', { exact: true }).fill('debian');
    await expect(page.getByLabel('Toggle debian')).toBeVisible();
    await expect(page.getByLabel('Toggle redhat')).toHaveCount(0);

    await page.getByRole('button', { name: 'Clear filter' }).click();
    await expect(page.getByLabel('Toggle redhat')).toBeVisible();
    await expect(page.getByLabel('Toggle debian')).toBeVisible();
  });

  test('filtering by OS version narrows to the matching breed only', async ({
    page,
  }) => {
    await page.goto('/signatures');
    await expect(page.getByLabel('Toggle redhat')).toBeVisible();

    await page.getByLabel('Search for OS version').fill('rhel8');
    await expect(page.getByLabel('Toggle redhat')).toBeVisible();
    await expect(page.getByLabel('Toggle debian')).toHaveCount(0);
  });

  test('updating signatures refreshes the data without error', async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/signatures');
    await expect(page.getByLabel('Toggle redhat')).toBeVisible();

    await page
      .locator('button')
      .filter({ has: page.locator('mat-icon', { hasText: 'refresh' }) })
      .click();
    await expect(page.getByLabel('Toggle redhat')).toBeVisible();

    expect(
      pageErrors,
      `Uncaught page errors: ${pageErrors.map((e) => e.message).join('; ')}`,
    ).toHaveLength(0);
  });
});
