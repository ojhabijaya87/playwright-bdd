import { test as base, createBdd } from "playwright-bdd";
import {
  browserManager,
  BrowserSingleton,
} from "../../supports/utilities/browserSingleton";
import { pageManager, PageManager } from "../../supports/utilities/pageManager";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables before the test run
const env = process.env.NODE_ENV || "qa";
dotenv.config({ path: `env/.env.${env}` });

type Fixtures = {
  // set types of your fixtures
};

export const test = base.extend<Fixtures>({
  // add your fixtures
});

export const { Given, When, Then, Before, After, BeforeAll, AfterAll } =
  createBdd(test);

// Use environment variables
export const baseURL = process.env.BASE_URL || "";
export const apiURL = process.env.API_URL || "";
export const browserType = process.env.BROWSER || "chromium"; // Default to Chromium
export const headless = process.env.HEAD === "true"; // Check if headless mode is required

Before({ tags: "@web", timeout: 60000 }, async function () {
  await pageManager.getBasePage().navigate(baseURL);
});

// Launch the browser before all scenarios
BeforeAll(async () => {
  await browserManager.launchBrowser(browserType, headless);
  console.log(`Browser launched: ${browserType}`);

  // Initialize all POM pages
  await pageManager.initializePages();
});

// After each scenario, close the current page
After(async () => {
  await pageManager.closePage();
  console.log("Page closed after scenario");
});

// After all scenarios, close the browser
AfterAll(async () => {
  await browserManager.closeBrowser();
  console.log("Browser closed after all scenarios");
});
