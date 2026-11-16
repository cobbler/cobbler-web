import { test, expect } from '../fixtures/auth.fixture';

// "Updating Signatures" is the fixed, backend-hardcoded display name for the task started by
// background_signature_update() - a stable, always-available real event to assert against,
// instead of relying on events left over from other specs (e.g. the sync action).
const EVENT_NAME = 'Updating Signatures';

test.describe('Events', () => {
  test('renders a completed backend event and filters by name and state', async ({
    page,
    backend,
  }) => {
    const eventId = await backend.backgroundSignatureUpdate();
    const state = await backend.waitForTaskCompletion(eventId);
    expect(state).toBe('complete');

    await page.goto('/events');
    await expect(
      page.getByRole('row', { name: new RegExp(EVENT_NAME) }).first(),
    ).toBeVisible();

    await page.getByLabel('Name').click();
    await page.getByRole('option', { name: EVENT_NAME, exact: true }).click();
    const nameFilteredRows = page.getByRole('row').filter({
      hasNot: page.getByRole('columnheader'),
    });
    await expect(nameFilteredRows.first()).toBeVisible();
    for (const row of await nameFilteredRows.all()) {
      await expect(row).toContainText(EVENT_NAME);
    }

    await page.getByLabel('State').click();
    await page.getByRole('option', { name: 'Complete', exact: true }).click();
    await expect(
      page.getByRole('row', { name: new RegExp(EVENT_NAME) }).first(),
    ).toBeVisible();
  });

  test('clicking an event name opens its log in a dialog', async ({
    page,
    backend,
  }) => {
    const eventId = await backend.backgroundSignatureUpdate();
    await backend.waitForTaskCompletion(eventId);

    await page.goto('/events');
    await page.getByLabel('Name').click();
    await page.getByRole('option', { name: EVENT_NAME, exact: true }).click();

    await page.locator('a', { hasText: EVENT_NAME }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: `Log for: ${EVENT_NAME}` }),
    ).toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('the row action menu can also open the log dialog', async ({
    page,
    backend,
  }) => {
    const eventId = await backend.backgroundSignatureUpdate();
    await backend.waitForTaskCompletion(eventId);

    await page.goto('/events');
    await page.getByLabel('Name').click();
    await page.getByRole('option', { name: EVENT_NAME, exact: true }).click();

    const row = page.getByRole('row', { name: new RegExp(EVENT_NAME) }).first();
    await row.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Show Logs' }).click();

    await expect(
      page.getByRole('dialog').getByRole('heading', {
        name: `Log for: ${EVENT_NAME}`,
      }),
    ).toBeVisible();
  });
});
