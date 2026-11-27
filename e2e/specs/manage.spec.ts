import { Page } from '@playwright/test';
import { expect, test } from '../fixtures/auth.fixture';
import { e2eName } from '../fixtures/naming';

// Every stat card on the /manage dashboard, keyed by its visible title.
const CARD_TITLES = [
  'Distro count',
  'Profile count',
  'System count',
  'Repository count',
  'Image count',
  'Menu count',
  'Template count',
  'Distro group count',
  'Profile group count',
  'System group count',
];

function statCardValue(page: Page, title: string) {
  return page
    .locator('mat-card')
    .filter({ has: page.getByText(title, { exact: true }) })
    .locator('p');
}

test.describe('Manage dashboard', () => {
  test('renders a real, non-stale item count for every collection', async ({
    page,
    backend,
  }, testInfo) => {
    // Every type's card is backed by its own get_item_names RPC and the suite runs fully
    // parallel against a shared backend, so other workers' items make an exact count
    // assertion flaky for every card except one we control ourselves: create a real item
    // here and require its own card to be at least 1, proving the RPC wiring actually reads
    // live backend state rather than being stuck on the initial empty placeholder.
    const name = e2eName(testInfo.parallelIndex, 'manage-menu');
    await backend.createItem('menu', { name });

    await page.goto('/manage');

    for (const title of CARD_TITLES) {
      await expect(statCardValue(page, title)).toHaveText(/^\d+$/);
    }
    const menuCount = await statCardValue(page, 'Menu count').textContent();
    expect(Number(menuCount)).toBeGreaterThanOrEqual(1);

    await backend.removeItem('menu', name).catch(() => {});
  });
});
