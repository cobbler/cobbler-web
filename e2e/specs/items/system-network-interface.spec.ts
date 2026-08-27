import { expect, test } from '../../fixtures/auth.fixture';
import {
  createAncestorChain,
  removeAncestorChain,
} from '../../fixtures/ancestors';
import { e2eName } from '../../fixtures/naming';
import { systemConfig } from '../../item-configs/system.config';

/**
 * NetworkInterface is a sub-resource of System (route /items/system/:name/interface/...),
 * modified via modify_system's 'delete_interface' operation rather than its own
 * new_/modify_/save_/remove_ RPC surface — so it doesn't fit item-crud.page.ts's generic flow.
 */
test.describe('System network interface', () => {
  test('create, edit, and delete a network interface under a system', async ({
    page,
    backend,
  }, testInfo) => {
    const { chain, immediateParentUid: profileUid } = await createAncestorChain(
      backend,
      systemConfig,
      testInfo.parallelIndex,
    );
    const systemName = e2eName(testInfo.parallelIndex, 'system');
    await backend.createItem(
      'system',
      systemConfig.createFields({ name: systemName, parentUid: profileUid }),
    );

    try {
      const interfaceName = 'eth0';

      await page.goto(`/items/system/${systemName}/interface`);
      await page.locator('[data-testid="item-add-button"]').click();
      await page.locator('[formcontrolname="name"]').fill(interfaceName);
      await page
        .locator('[formcontrolname="mac_address"]')
        .fill('52:54:00:11:22:33');
      await page.locator('[data-testid="item-create-submit"]').click();
      // Creation navigates straight to the new interface's edit page (same pattern as every
      // other item type's create dialog), not back to the overview list.
      await expect(page).toHaveURL(new RegExp(`/interface/${interfaceName}`));

      // The IPv4 and IPv6 field groups both render a plain "MTU" label (only their enclosing
      // option-group card's heading distinguishes them), so scope to the "IPv4" card first.
      const ipv4Card = page.locator('mat-card').filter({ hasText: 'IPv4' });

      await page.locator('[data-testid="item-edit-toggle"]').click();
      await ipv4Card.getByLabel('MTU').fill('1500');
      await page.locator('[data-testid="item-save-button"]').click();
      await page.reload();
      await expect(ipv4Card.getByLabel('MTU')).toHaveValue('1500');

      await page.goto(`/items/system/${systemName}/interface`);
      await page
        .getByRole('row', { name: interfaceName })
        .getByRole('button')
        .click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await expect(page.getByRole('row', { name: interfaceName })).toHaveCount(
        0,
      );
    } finally {
      await backend.removeItem('system', systemName, true).catch(() => {});
      await removeAncestorChain(backend, chain);
    }
  });
});
