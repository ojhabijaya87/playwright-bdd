import { Page, expect, Locator } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to a specific URL
  async navigate(url: string) {
    await this.page.goto(url);
  }

  // Fill text field
  async fill(field: Locator, value: string) {
    await field.waitFor({ state: "visible" });
    await field.click();
    await field.clear();
    await field.fill(value);
  }

  // Click a button or element
  async click(element: Locator) {
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  // Verify text is present in an element
  async verifyText(element: Locator, expectedText: string) {
    await expect(element).toContainText(expectedText);
  }

  // Wait for an element to be visible
  async waitForElement(element: Locator) {
    await expect(element).toBeVisible();
  }
}
