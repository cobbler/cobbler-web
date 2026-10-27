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
      const { chain, immediateParentUid } = await createAncestorChain(
        backend,
        config,
        testInfo.parallelIndex,
      );

      try {
        const name = e2eName(testInfo.parallelIndex, config.type);
        const itemPage = new ItemCrudPage(page, config);

        await itemPage.gotoOverview();
        await itemPage.create(
          config.createFields({ name, parentUid: immediateParentUid }),
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

        await itemPage.delete(renamedName);
        await itemPage.expectRowHidden(renamedName);
      } finally {
        await removeAncestorChain(backend, chain);
      }
    });
  });
}
