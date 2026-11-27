import { Page, expect } from '@playwright/test';
import { ItemConfig } from '../item-configs/types';

/**
 * Generic, config-driven page object covering the CRUD flow shared by every "standard"
 * item type (distro/profile/system/repository/image/menu):
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

  /**
   * Opens the create dialog, fills the given fields, submits, and waits for the edit-page nav.
   * The parent-reference field (`config.requiresParent.formControlName`) is a mat-select whose
   * options are labelled by item name, so it is picked by `parentName` rather than filled.
   */
  async create(
    fields: Record<string, string>,
    parentName?: string,
  ): Promise<void> {
    await this.page.locator('[data-testid="item-add-button"]').click();
    const parentField = this.config.requiresParent?.formControlName;
    for (const [formControlName, value] of Object.entries(fields)) {
      const control = this.page.locator(
        `[formcontrolname="${formControlName}"]`,
      );
      if (formControlName === parentField) {
        if (!parentName) {
          throw new Error(
            `parentName is required to pick "${formControlName}" in the create dialog`,
          );
        }
        await control.click();
        await this.page
          .getByRole('option', { name: parentName, exact: true })
          .click();
      } else {
        await control.fill(value);
      }
    }
    await this.page.locator('[data-testid="item-create-submit"]').click();
    await expect(this.page).toHaveURL(
      new RegExp(`${this.config.overviewRoute}/`),
    );
  }

  async gotoEdit(name: string): Promise<void> {
    await this.page.goto(`${this.config.overviewRoute}/${name}`);
    // The edit page's refreshData() RPC chain populates every form field asynchronously
    // (including re-patching dirty values if it resolves after an edit starts) - every item
    // type has a readonly "UID" field, only ever set once that chain resolves, so wait on it
    // rather than relying on incidental navigation timing before interacting with the form.
    await expect(this.page.getByLabel('UID')).not.toHaveValue('');
  }

  async edit(field: { label: string; value: string }): Promise<void> {
    const editToggle = this.page.locator('[data-testid="item-edit-toggle"]');
    await editToggle.click();
    await this.page.getByLabel(field.label).fill(field.value);
    await this.page.locator('[data-testid="item-save-button"]').click();
    // Save chains several sequential RPCs (get_<type>_handle -> modify_<type> per dirty field ->
    // save_<type>) before flipping isEditMode back to false - clicking the button only dispatches
    // the click, so wait for the toggle to re-enable (`[disabled]="isEditMode"`) as the real
    // "save actually completed" signal, rather than racing a reload against it.
    await expect(editToggle).toBeEnabled();
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

  /**
   * Clones an item via the edit page's "Copy" icon button (content_copy), shared verbatim across
   * every item type's edit template, and waits for the nav to the clone's own edit page.
   */
  async clone(name: string, newName: string): Promise<void> {
    await this.gotoEdit(name);
    await this.page
      .locator('button')
      .filter({
        has: this.page.locator('mat-icon', { hasText: 'content_copy' }),
      })
      .click();
    await this.page.getByLabel('New name').fill(newName);
    await this.page.getByRole('button', { name: 'Copy', exact: true }).click();
    await expect(this.page).toHaveURL(
      new RegExp(`${this.config.overviewRoute}/${newName}`),
    );
  }

  async delete(name: string): Promise<void> {
    await this.gotoOverview();
    await this.openRowMenu(name);
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
  }

  /**
   * Matches a row whose accessible name starts with `name` followed by either the end of the
   * string or a space (e.g. Image rows append " x86_64") - but NOT by a hyphen continuing the
   * identifier (e.g. a coexisting "<name>-clone" row), which plain substring matching would also
   * match ambiguously.
   */
  private rowNamePattern(name: string): RegExp {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${escaped}(\\s|$)`);
  }

  async expectRowVisible(name: string): Promise<void> {
    await expect(
      this.page.getByRole('row', { name: this.rowNamePattern(name) }),
    ).toBeVisible();
  }

  async expectRowHidden(name: string): Promise<void> {
    await expect(
      this.page.getByRole('row', { name: this.rowNamePattern(name) }),
    ).toHaveCount(0);
  }
}
