import { Page, expect } from '@playwright/test';
import { ItemConfig } from '../item-configs/types';

/**
 * Generic, config-driven page object covering the CRUD flow shared by every "standard"
 * item type (distro/profile/system/repository/image/management-class/package/file/menu):
 * overview list -> create dialog -> edit page -> rename -> delete. All of these types follow
 * the identical dialog.open(XCreate)/isEditMode/mat-menu(Rename/Delete) pattern.
 */
export class ItemCrudPage {
  constructor(
    private readonly page: Page,
    private readonly config: ItemConfig,
  ) {}

  async gotoOverview(): Promise<void> {
    await this.page.goto(this.config.overviewRoute);
  }

  /** Opens the create dialog, fills the given fields, submits, and waits for the edit-page nav. */
  async create(fields: Record<string, string>): Promise<void> {
    await this.page.locator('[data-testid="item-add-button"]').click();
    for (const [formControlName, value] of Object.entries(fields)) {
      await this.page
        .locator(`[formcontrolname="${formControlName}"]`)
        .fill(value);
    }
    await this.page.locator('[data-testid="item-create-submit"]').click();
    await expect(this.page).toHaveURL(
      new RegExp(`${this.config.overviewRoute}/`),
    );
  }

  async gotoEdit(name: string): Promise<void> {
    await this.page.goto(`${this.config.overviewRoute}/${name}`);
  }

  async edit(field: { label: string; value: string }): Promise<void> {
    await this.page.locator('[data-testid="item-edit-toggle"]').click();
    await this.page.getByLabel(field.label).fill(field.value);
    await this.page.locator('[data-testid="item-save-button"]').click();
  }

  async expectFieldValue(label: string, value: string): Promise<void> {
    await expect(this.page.getByLabel(label)).toHaveValue(value);
  }

  private async openRowMenu(name: string): Promise<void> {
    const row = this.page.getByRole('row', { name });
    await row.getByRole('button').click();
  }

  async rename(oldName: string, newName: string): Promise<void> {
    await this.gotoOverview();
    await this.openRowMenu(oldName);
    await this.page.getByRole('menuitem', { name: 'Rename' }).click();
    await this.page.getByLabel('New name').fill(newName);
    await this.page.getByRole('button', { name: 'Rename' }).click();
  }

  async delete(name: string): Promise<void> {
    await this.gotoOverview();
    await this.openRowMenu(name);
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
  }

  async expectRowVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('row', { name })).toBeVisible();
  }

  async expectRowHidden(name: string): Promise<void> {
    await expect(this.page.getByRole('row', { name })).toHaveCount(0);
  }
}
