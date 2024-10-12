// pages/basePage.ts

import { Page } from "@playwright/test";

export class BasePage {
  constructor(public page: Page) {}

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    console.log(`Navigated to URL: ${url}`);
  }

  /**
   * Getter for the Page instance.
   */
  getPage(): Page {
    return this.page;
  }
}
