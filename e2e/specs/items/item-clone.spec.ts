import { expect, test } from '../../fixtures/auth.fixture';
import {
  createAncestorChain,
  removeAncestorChain,
} from '../../fixtures/ancestors';
import { e2eName } from '../../fixtures/naming';
import { STANDARD_ITEM_CONFIGS } from '../../item-configs';
import { ItemCrudPage } from '../../page-objects/item-crud.page';

/**
 * Every standard item type's edit page exposes the identical "Copy" icon-button ->
 * dialog-item-copy.component flow (new name -> copy_<type> RPC -> navigate to the clone's own
 * edit page). This confirms the clone becomes an independent item with its own uid, not an alias
 * of the source, and that editing the clone never mutates the original.
 */
for (const config of STANDARD_ITEM_CONFIGS) {
  test.describe(`${config.label} clone`, () => {
    test(`cloning a ${config.label} creates an independent item`, async ({
      page,
      backend,
    }, testInfo) => {
      const { chain, immediateParentUid, immediateParentName } =
        await createAncestorChain(backend, config, testInfo.parallelIndex);

      const name = e2eName(testInfo.parallelIndex, config.type);
      const cloneName = `${name}-clone`;
      const itemPage = new ItemCrudPage(page, config);

      try {
        await itemPage.gotoOverview();
        await itemPage.create(
          config.createFields({ name, parentUid: immediateParentUid }),
          immediateParentName,
        );

        await itemPage.clone(name, cloneName);

        // gotoEdit() re-navigates (rather than reusing clone()'s in-place nav), giving the new
        // edit page's refreshData() RPC chain time to resolve before edit() touches the form -
        // same reason item-crud.spec.ts's create() is always followed by a separate gotoEdit()
        // rather than editing immediately after create's own navigation.
        await itemPage.gotoEdit(cloneName);

        // The clone is independently editable, and editing it must not mutate the original.
        await itemPage.edit(config.editableField);
        await page.reload();
        await itemPage.expectFieldValue(
          config.editableField.label,
          config.editableField.value,
        );

        await itemPage.gotoOverview();
        await itemPage.expectRowVisible(name);
        await itemPage.expectRowVisible(cloneName);

        await itemPage.gotoEdit(name);
        await expect(
          page.getByLabel(config.editableField.label),
        ).not.toHaveValue(config.editableField.value);
      } finally {
        await backend
          .removeItem(config.xmlrpcType, cloneName, true)
          .catch(() => {});
        await backend.removeItem(config.xmlrpcType, name, true).catch(() => {});
        await removeAncestorChain(backend, chain);
      }
    });
  });
}
