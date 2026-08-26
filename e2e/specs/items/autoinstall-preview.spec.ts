import { expect, test } from '../../fixtures/auth.fixture';
import {
  createAncestorChain,
  removeAncestorChain,
} from '../../fixtures/ancestors';
import { e2eName } from '../../fixtures/naming';
import { profileConfig } from '../../item-configs/profile.config';
import { systemConfig } from '../../item-configs/system.config';

/** /items/profile/:name/autoinstall and /items/system/:name/autoinstall — rendered-preview pages. */
test.describe('Autoinstall preview', () => {
  test('renders the generated autoinstall content for a profile', async ({
    page,
    backend,
  }, testInfo) => {
    const { chain, immediateParentName: distroName } =
      await createAncestorChain(backend, profileConfig, testInfo.parallelIndex);
    const profileName = e2eName(testInfo.parallelIndex, 'profile');
    await backend.createItem(
      'profile',
      profileConfig.createFields({ name: profileName, parentName: distroName }),
    );

    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    try {
      await page.goto(`/items/profile/${profileName}/autoinstall`);
      await expect(page.locator('textarea')).toBeVisible();
      expect(
        pageErrors,
        `Uncaught page errors: ${pageErrors.map((e) => e.message).join('; ')}`,
      ).toHaveLength(0);
    } finally {
      await backend.removeItem('profile', profileName, true).catch(() => {});
      await removeAncestorChain(backend, chain);
    }
  });

  test('renders the generated autoinstall content for a system', async ({
    page,
    backend,
  }, testInfo) => {
    const { chain, immediateParentName: profileName } =
      await createAncestorChain(backend, systemConfig, testInfo.parallelIndex);
    const systemName = e2eName(testInfo.parallelIndex, 'system');
    await backend.createItem(
      'system',
      systemConfig.createFields({ name: systemName, parentName: profileName }),
    );

    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    try {
      await page.goto(`/items/system/${systemName}/autoinstall`);
      await expect(page.locator('textarea')).toBeVisible();
      expect(
        pageErrors,
        `Uncaught page errors: ${pageErrors.map((e) => e.message).join('; ')}`,
      ).toHaveLength(0);
    } finally {
      await backend.removeItem('system', systemName, true).catch(() => {});
      await removeAncestorChain(backend, chain);
    }
  });
});
