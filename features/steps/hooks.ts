import { test as base, createBdd } from "playwright-bdd";
import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  firefox,
  webkit,
  request,
} from "@playwright/test";
import * as dotenv from "dotenv";
import { BasePage } from "../../supports/pages/basePage";
import { LoginPage } from "../../supports/pages/loginPage";
import { AddContactPage } from "../../supports/pages/addContactPage";
import { EditContactPage } from "../../supports/pages/editContactPage";
import { ContactListPage } from "../../supports/pages/contactListPage";
import { RegisterPage } from "../../supports/pages/registerPage";
import { DataGenerator } from "../../supports/utilities/dataGenerator";
import { APITestContext } from "../../supports/utilities/apiClient ";

// Load environment variables
const env = process.env.NODE_ENV || "qa";
dotenv.config({ path: `env/.env.${env}` });

const baseURL = process.env.BASE_URL;
export const apiURL = process.env.API_URL;
export let sharedNewContact: ReturnType<typeof DataGenerator.generateContact>;
export let sharedUser: ReturnType<typeof DataGenerator.generateUser>;

// Lazy initialization function
const lazyInit = <T>(PageClass: new (page: Page) => T) => {
  let instance: T | undefined;
  return (page: Page) => {
    if (!instance) instance = new PageClass(page);
    return instance;
  };
};

// Define fixtures
type Fixtures = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  apiContext: APITestContext;
  basePage: BasePage;
  loginPage: LoginPage;
  addContactPage: AddContactPage;
  editContactPage: EditContactPage;
  contactListPage: ContactListPage;
  registerPage: RegisterPage;
  user: ReturnType<typeof DataGenerator.generateUser>;
  newContact: ReturnType<typeof DataGenerator.generateContact>;
  updatedContact: ReturnType<typeof DataGenerator.generateUpdatedContact>;
};

// Extend Playwright test with custom fixtures
export const test = base.extend<Fixtures>({
  browser: async ({}: any, use: (browser: Browser) => Promise<void>) => {
    await launchBrowser(use);
  },

  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },

  apiContext: async ({ request }, use) => {
    const apiContext = new APITestContext(apiURL || "", request);
    await apiContext.initialize();
    await use(apiContext);
  },

  // Lazy initialization of pages
  basePage: async ({ page }, use) => {
    await use(lazyInit(BasePage)(page));
  },

  registerPage: async ({ page }, use) => {
    await use(lazyInit(RegisterPage)(page));
  },

  loginPage: async ({ page }, use) => {
    await use(lazyInit(LoginPage)(page));
  },

  addContactPage: async ({ page }, use) => {
    await use(lazyInit(AddContactPage)(page));
  },

  editContactPage: async ({ page }, use) => {
    await use(lazyInit(EditContactPage)(page));
  },

  contactListPage: async ({ page }, use) => {
    await use(lazyInit(ContactListPage)(page));
  },

  user: async ({}, use) => {
    if (!sharedUser) {
      sharedUser = DataGenerator.generateUser();
    }
    await use(sharedUser);
  },

  newContact: async ({}, use) => {
    if (!sharedNewContact) {
      sharedNewContact = DataGenerator.generateContact();
    }
    await use(sharedNewContact);
  },

  updatedContact: async ({}, use) => {
    const updatedContact = DataGenerator.generateUpdatedContact();
    await use(updatedContact);
  },
});

export async function launchBrowser(use: (browser: Browser) => Promise<void>) {
  const browserType = process.env.BROWSER || "chromium";
  const headless = process.env.HEADLESS === "false";

  let browser: Browser;

  switch (browserType) {
    case "firefox":
      browser = await firefox.launch({ headless });
      break;
    case "webkit":
      browser = await webkit.launch({ headless });
      break;
    default:
      browser = await chromium.launch({ headless });
  }

  try {
    await use(browser);
  } finally {
    await browser.close();
  }
}

// Hooks
export const { Given, When, Then, Before, After, BeforeAll, AfterAll } =
  createBdd(test);

Before({ tags: "@web", timeout: 60000 }, async ({ basePage }) => {
  await basePage.navigate(baseURL || "");
});

Before({ tags: "@api", timeout: 60000 }, async () => {
  console.log("Starting the API test suite...");
});

BeforeAll(async () => {
  console.log("Starting the test suite...");
  sharedUser = DataGenerator.generateUser();
  sharedNewContact = DataGenerator.generateContact();
});

After(async () => {
  console.log("Scenario finished. Closing the page...");
});

AfterAll(async () => {
  console.log("Test suite finished. Closing the browser...");
});
