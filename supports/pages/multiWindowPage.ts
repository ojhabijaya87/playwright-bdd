// pages/multiWindowPage.ts

import { expect, Page, TestInfo } from "@playwright/test";

export class MultiWindowPage {
  private originalPage: Page;
  private newPage: Page | null = null;

  constructor(private page: Page) {
    this.originalPage = page;
  }

  /**
   * Opens a new window by clicking on the specified link text.
   * @param linkText The text of the link to click.
   */
  async openNewWindow(linkText: string): Promise<void> {
    const context = this.page.context();

    // Listen for the new page event and click the link simultaneously
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      this.page.click(`text="${linkText}"`),
    ]);

    await newPage.waitForLoadState();
    console.log(`New Page Title: ${await newPage.title()}`);
    this.newPage = newPage;
  }

  /**
   * Switches focus to the new window.
   */
  async switchToNewWindow(): Promise<void> {
    if (!this.newPage) {
      throw new Error("New window is not available.");
    }

    await this.newPage.bringToFront();
    console.log("Switched to the new window");
  }

  /**
   * Switches focus back to the original window.
   */
  async switchBackToOriginalWindow(): Promise<void> {
    await this.originalPage.bringToFront();
    console.log("Switched back to the original window");
  }

  /**
   * Verifies the content of the new window.
   * @param expectedText The expected text to verify in the new window.
   */
  async verifyNewWindowContent(expectedText: string): Promise<void> {
    if (!this.newPage) {
      throw new Error("New window is not available for verification.");
    }

    const text = await this.newPage.textContent("body");
    expect(text).toContain(expectedText);
    console.log(`Verified content in the new window: ${expectedText}`);
  }

  /**
   * Verifies the title of the original window.
   * @param expectedTitle The expected title of the original window.
   */
  async verifyOriginalWindowTitle(expectedTitle: string): Promise<void> {
    const title = await this.originalPage.title();
    expect(title).toBe(expectedTitle);
    console.log(`Verified title in the original window: ${expectedTitle}`);
  }

  /**
   * Verifies that the content of the original window remains unchanged.
   * @param expectedText The expected unchanged text in the original window.
   */
  async verifyOriginalWindowContent(expectedText: string): Promise<void> {
    const text = await this.originalPage.textContent("body");
    expect(text).toContain(expectedText);
    console.log(`Verified content in the original window: ${expectedText}`);
  }
}
