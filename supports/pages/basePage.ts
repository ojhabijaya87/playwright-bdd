import { Page, expect, Locator } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async fill(field: Locator, value: string) {
    await field.waitFor({ state: "visible" });
    await field.click();
    await field.clear();
    await field.fill(value);
  }

  async click(element: Locator) {
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  async verifyText(element: Locator, expectedText: string) {
    await expect(element).toContainText(expectedText);
  }

  async waitForElement(element: Locator) {
    await expect(element).toBeVisible();
  }
}
