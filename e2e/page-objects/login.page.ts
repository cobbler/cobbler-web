import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Server field is pre-filled from the app's configured COBBLER_URL; only override it if given. */
  async login(
    username: string,
    password: string,
    server?: string,
  ): Promise<void> {
    if (server) {
      await this.page.locator('[formcontrolname="server"]').fill(server);
    }
    await this.page.locator('[formcontrolname="username"]').fill(username);
    await this.page.locator('[formcontrolname="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/manage/);
  }

  async expectError(): Promise<void> {
    await expect(this.page.locator('.alert-warning')).toBeVisible();
  }
}
