// utils/browserSingleton.ts

import { Browser, chromium, firefox, webkit, BrowserContext } from "@playwright/test";

export class BrowserSingleton {
  private static instance: BrowserSingleton;
  private browser!: Browser;
  private context!: BrowserContext;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Method to get the singleton instance
  public static getInstance(): BrowserSingleton {
    if (!BrowserSingleton.instance) {
      BrowserSingleton.instance = new BrowserSingleton();
    }
    return BrowserSingleton.instance;
  }

  // Method to launch the browser
  public async launchBrowser(browserType: string, headless: boolean) {
    if (this.browser) {
      console.warn("Browser is already launched.");
      return;
    }

    switch (browserType.toLowerCase()) {
      case "firefox":
        this.browser = await firefox.launch({ headless });
        break;
      case "webkit":
        this.browser = await webkit.launch({ headless });
        break;
      case "chromium":
      default:
        this.browser = await chromium.launch({ headless });
    }

    this.context = await this.browser.newContext();
    console.log(`Browser launched: ${browserType}`);
  }

  // Method to get the browser context
  public getContext(): BrowserContext {
    if (!this.context) {
      throw new Error("Browser context is not initialized.");
    }
    return this.context;
  }

  // Method to close the browser
  public async closeBrowser() {
    if (!this.browser) {
      console.warn("Browser is not launched.");
      return;
    }
    await this.browser.close();
    console.log("Browser closed.");
  }
}
// Export a singleton instance for easy access
export const browserManager = BrowserSingleton.getInstance();