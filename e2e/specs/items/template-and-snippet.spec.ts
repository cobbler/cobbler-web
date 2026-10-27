import { expect, test } from '../../fixtures/auth.fixture';
import { e2eName } from '../../fixtures/naming';

/**
 * Cobbler 4.x unified Template and Snippet into a single "template" Item collection (new_template/
 * modify_template/save_template/get_template/remove_template) - there is no more standalone
 * Snippet route or RPC set, so only Template is covered here.
 *
 * The overview table paginates at 10 rows and Cobbler ships more than 10 built-in templates, so
 * a freshly created template can land outside the default first page - the tests filter by name
 * (same Filter input a real user would use) before interacting with its row. The filter is wired
 * to a (keyup) handler, not (input), so it must be typed via pressSequentially() - fill() sets the
 * value without dispatching keyup and silently leaves the table unfiltered.
 */
test.describe('Template CRUD', () => {
  test('create, edit content, rename, and delete a Template', async ({
    page,
    backend,
  }, testInfo) => {
    const name = e2eName(testInfo.parallelIndex, 'template');
    const renamedName = `${name}-renamed`;

    await page.goto('/items/template');
    await page.locator('[data-testid="item-add-button"]').click();
    await page.locator('[formcontrolname="name"]').fill(name);
    await page
      .locator('[formcontrolname="content"]')
      .fill('# e2e initial content\n');
    await page.locator('[data-testid="item-create-submit"]').click();
    await expect(page).toHaveURL(/\/items\/template\//);

    await page.goto(`/items/template/${name}`);
    await page.locator('[data-testid="item-edit-toggle"]').click();
    await page
      .locator('[formcontrolname="content"]')
      .fill('# e2e edited content\n');
    await page.locator('[data-testid="item-save-button"]').click();
    await page.reload();
    await expect(page.locator('[formcontrolname="content"]')).toHaveValue(
      '# e2e edited content\n',
    );

    await page.goto('/items/template');
    await page.getByLabel('Filter').pressSequentially(name);
    await page.getByRole('row', { name }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Rename' }).click();
    await page.getByLabel('New name').fill(renamedName);
    await page.getByRole('button', { name: 'Rename' }).click();
    await page.getByLabel('Filter').clear();
    await page.getByLabel('Filter').pressSequentially(renamedName);
    await expect(page.getByRole('row', { name: renamedName })).toBeVisible();

    await page
      .getByRole('row', { name: renamedName })
      .getByRole('button')
      .click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByRole('row', { name: renamedName })).toHaveCount(0);

    // Best-effort cleanup in case an assertion above threw before the UI delete ran.
    await backend.removeItem('template', name).catch(() => {});
  });
});
