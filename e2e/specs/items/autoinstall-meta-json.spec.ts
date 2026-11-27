import { expect, test } from '../../fixtures/auth.fixture';
import { e2eName } from '../../fixtures/naming';
import { distroConfig } from '../../item-configs/distro.config';
import { ItemCrudPage } from '../../page-objects/item-crud.page';

/**
 * autoinstall_meta is a real Dict[Any, Any] server-side (cobbler/items/abstract/bootable_item.py)
 * and the wire serialization already recurses through arbitrary nested objects/arrays
 * (cobbler-api.service.ts's toXmlRpcValue) - the only gap is that KeyValueEditorComponent's flat
 * key=value row UI has no way to enter or display nested data. This proves the JSON-mode escape
 * hatch added for that gap round-trips a cloud-init-shaped structure end-to-end through a real
 * v4.0.0 backend.
 */
test.describe('autoinstall_meta JSON mode', () => {
  test('accepts and round-trips a nested cloud-init-shaped structure', async ({
    page,
    backend,
  }, testInfo) => {
    const name = e2eName(testInfo.parallelIndex, 'distro');
    const nestedMeta = {
      'user-data': {
        users: [{ name: 'e2e-user', groups: ['sudo', 'wheel'] }],
        packages: ['vim', 'curl'],
      },
    };

    await backend.createItem('distro', distroConfig.createFields({ name }));

    try {
      const itemPage = new ItemCrudPage(page, distroConfig);
      await itemPage.gotoEdit(name);

      const metaCard = page
        .locator('mat-card')
        .filter({ hasText: 'Automatic Installation Template Metadata' });

      await page.locator('[data-testid="item-edit-toggle"]').click();
      await metaCard.locator('[data-testid="key-value-mode-json"]').click();
      await metaCard
        .locator('[data-testid="key-value-json-textarea"]')
        .fill(JSON.stringify(nestedMeta, null, 2));
      await expect(
        metaCard.locator('[data-testid="key-value-json-error"]'),
      ).toHaveCount(0);

      const editToggle = page.locator('[data-testid="item-edit-toggle"]');
      await page.locator('[data-testid="item-save-button"]').click();
      await expect(editToggle).toBeEnabled();
      await page.reload();

      // Nested data must auto-default back to JSON mode on reload, not render as broken rows.
      const textarea = metaCard.locator(
        '[data-testid="key-value-json-textarea"]',
      );
      await expect(textarea).toBeVisible();
      const roundTripped = JSON.parse((await textarea.inputValue()) || '{}');
      expect(roundTripped).toEqual(nestedMeta);

      const stored = await backend.getItem('distro', name);
      expect(stored['autoinstall_meta']).toEqual(nestedMeta);
    } finally {
      await backend.removeItem('distro', name).catch(() => {});
    }
  });

  test('invalid JSON shows a visible error and blocks save', async ({
    page,
    backend,
  }, testInfo) => {
    const name = e2eName(testInfo.parallelIndex, 'distro');
    await backend.createItem('distro', distroConfig.createFields({ name }));

    try {
      const itemPage = new ItemCrudPage(page, distroConfig);
      await itemPage.gotoEdit(name);

      const metaCard = page
        .locator('mat-card')
        .filter({ hasText: 'Automatic Installation Template Metadata' });

      await page.locator('[data-testid="item-edit-toggle"]').click();
      await metaCard.locator('[data-testid="key-value-mode-json"]').click();
      await metaCard
        .locator('[data-testid="key-value-json-textarea"]')
        .fill('{ not valid json');

      await expect(
        metaCard.locator('[data-testid="key-value-json-error"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="item-save-button"]'),
      ).toBeDisabled();
      await expect(
        metaCard.locator('[data-testid="key-value-mode-simple"]'),
      ).toBeDisabled();
    } finally {
      await backend.removeItem('distro', name).catch(() => {});
    }
  });
});
