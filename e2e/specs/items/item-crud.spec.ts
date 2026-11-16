import { test } from '../../fixtures/auth.fixture';
import {
  createAncestorChain,
  removeAncestorChain,
} from '../../fixtures/ancestors';
import { e2eName } from '../../fixtures/naming';
import { STANDARD_ITEM_CONFIGS } from '../../item-configs';
import { ItemCrudPage } from '../../page-objects/item-crud.page';

for (const config of STANDARD_ITEM_CONFIGS) {
  test.describe(`${config.label} CRUD`, () => {
    test(`create, edit, rename, and delete a ${config.label}`, async ({
      page,
      backend,
    }, testInfo) => {
      const { chain, immediateParentUid, immediateParentName } =
        await createAncestorChain(backend, config, testInfo.parallelIndex);

      try {
        const name = e2eName(testInfo.parallelIndex, config.type);
        const itemPage = new ItemCrudPage(page, config);

        await itemPage.gotoOverview();
        await itemPage.create(
          config.createFields({ name, parentUid: immediateParentUid }),
          immediateParentName,
        );

        await itemPage.gotoEdit(name);
        await itemPage.edit(config.editableField);
        await page.reload();
        await itemPage.expectFieldValue(
          config.editableField.label,
          config.editableField.value,
        );

        const renamedName = `${name}-renamed`;
        await itemPage.rename(name, renamedName);
        await itemPage.expectRowVisible(renamedName);

        // Cobbler 4.0.0's resolution is uid-based, not name-based - confirm the item still
        // resolves and remains editable under its new name post-rename.
        await itemPage.gotoEdit(renamedName);
        const postRenameEditValue = `${config.editableField.value}-post-rename`;
        await itemPage.edit({
          label: config.editableField.label,
          value: postRenameEditValue,
        });
        await page.reload();
        await itemPage.expectFieldValue(
          config.editableField.label,
          postRenameEditValue,
        );

        await itemPage.delete(renamedName);
        await itemPage.expectRowHidden(renamedName);
      } finally {
        await removeAncestorChain(backend, chain);
      }
    });
  });
}
