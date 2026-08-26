import { expect, test } from '../../fixtures/auth.fixture';
import { e2eName } from '../../fixtures/naming';

/**
 * Template and Snippet are NOT Cobbler "Item" objects — they're backed by
 * read/write/remove_autoinstall_template file-content RPCs, not new_/modify_/save_/remove_<type>.
 * Same UI shape as the standard item types (create dialog, isEditMode edit, rename/delete via
 * mat-menu) so this reuses the same interaction style as item-crud.page.ts, just without the
 * generic XML-RPC-backed ItemConfig machinery.
 */
for (const type of ['template', 'snippet'] as const) {
  const label = type === 'template' ? 'Template' : 'Snippet';

  test.describe(`${label} CRUD`, () => {
    test(`create, edit content, rename, and delete a ${label}`, async ({
      page,
      backend,
    }, testInfo) => {
      const name = e2eName(testInfo.parallelIndex, type);
      const renamedName = `${name}-renamed`;

      await page.goto(`/items/${type}`);
      await page.locator('[data-testid="item-add-button"]').click();
      await page.locator('[formcontrolname="name"]').fill(name);
      await page
        .locator('[formcontrolname="content"]')
        .fill('# e2e initial content\n');
      await page.locator('[data-testid="item-create-submit"]').click();
      await expect(page).toHaveURL(new RegExp(`/items/${type}/`));

      await page.goto(`/items/${type}/${name}`);
      await page.locator('[data-testid="item-edit-toggle"]').click();
      await page
        .locator('[formcontrolname="content"]')
        .fill('# e2e edited content\n');
      await page.locator('[data-testid="item-save-button"]').click();
      await page.reload();
      await expect(page.locator('[formcontrolname="content"]')).toHaveValue(
        '# e2e edited content\n',
      );

      await page.goto(`/items/${type}`);
      await page.getByRole('row', { name }).getByRole('button').click();
      await page.getByRole('menuitem', { name: 'Rename' }).click();
      await page.getByLabel('New name').fill(renamedName);
      await page.getByRole('button', { name: 'Rename' }).click();
      await expect(page.getByRole('row', { name: renamedName })).toBeVisible();

      await page
        .getByRole('row', { name: renamedName })
        .getByRole('button')
        .click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await expect(page.getByRole('row', { name: renamedName })).toHaveCount(0);

      // Best-effort cleanup in case an assertion above threw before the UI delete ran.
      await backend.removeAutoinstallTemplate(name).catch(() => {});
    });
  });
}
