// pages/homePage.ts

import { Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  /**
   * Navigates to the specified page.
   * @param pageName The name of the page to navigate to.
   */
  async navigateToPage(pageName: string): Promise<void> {
    if (pageName === "Multiple Windows") {
      await this.page.goto("/windows");
      console.log("Navigated to the Multiple Windows page");
    } else {
      throw new Error(`Unknown page: ${pageName}`);
    }
  }

  /**
   * Clicks on a link with the specified text.
   * @param linkText The text of the link to click.
   */
  async clickLink(linkText: string): Promise<void> {
    await this.page.click(`text="${linkText}"`);
    console.log(`Clicked on link: ${linkText}`);
  }
}
