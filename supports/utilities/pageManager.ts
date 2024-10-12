// utils/pageManager.ts

import { Page } from "@playwright/test";
import { BrowserSingleton } from "./browserSingleton";
import { BasePage } from "../pages/basePage";
import { HomePage } from "../pages/homePage";
import { MultiWindowPage } from "../pages/multiWindowPage";

export class PageManager {
  private static instance: PageManager;
  private homePage!: HomePage;
  private multiWindowPage!: MultiWindowPage;
  private basePage!: BasePage;
  private page!: Page;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Method to get the singleton instance
  public static getInstance(): PageManager {
    if (!PageManager.instance) {
      PageManager.instance = new PageManager();
    }
    return PageManager.instance;
  }

  // Method to initialize all POM pages
  public async initializePages(): Promise<void> {
    const context = BrowserSingleton.getInstance().getContext();
    this.page = await context.newPage();

    this.basePage = new BasePage(this.page);
    this.homePage = new HomePage(this.page);
    this.multiWindowPage = new MultiWindowPage(this.page);

    console.log("All POM pages initialized.");
  }

  // Getters for POM pages
  public getHomePage(): HomePage {
    return this.homePage;
  }

  public getMultiWindowPage(): MultiWindowPage {
    return this.multiWindowPage;
  }

  public getBasePage(): BasePage {
    return this.basePage;
  }

  // Getter for the Page instance
  public getPage(): Page {
    return this.page;
  }

  // Method to close the current page
  public async closePage(): Promise<void> {
    if (this.page) {
      await this.page.close();
      console.log("Page closed.");
    } else {
      console.warn("No page to close.");
    }
  }
}

// Export a singleton instance for easy access
export const pageManager = PageManager.getInstance();
