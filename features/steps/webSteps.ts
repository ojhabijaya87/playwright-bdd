import { expect } from "@playwright/test";
import { Given, When, Then } from "./hooks";
import { pageManager } from "../../supports/utilities/pageManager";


Given(
  /^the user navigates to the "([^"]*)" page$/,
  async ({}, pageName: string) => {
    // Adjusted to include fixtures as first parameter
    console.log(`Navigating to the "${pageName}" page`);
    await pageManager.getHomePage().clickLink(pageName);
  }
);

// And the user opens a new window by clicking on "Click Here"
When(
  /^the user opens a new window by clicking on "([^"]*)"$/,
  async ({}, linkText: string) => {
    // Adjusted to include fixtures as first parameter
    console.log(`Opening a new window by clicking on "${linkText}"`);
    await pageManager.getMultiWindowPage().openNewWindow(linkText);
  }
);

When(/^the user switches to the new window$/, async () => {
  console.log("Switching to the new window");
  await pageManager.getMultiWindowPage().switchToNewWindow();
});

When(/^the user reads the content of the new window$/, async () => {
  console.log("Reading content of the new window");
  await pageManager.getMultiWindowPage().verifyNewWindowContent("New Window");
});

When(/^the user switches back to the original window$/, async () => {
  console.log("Switching back to the original window");
  await pageManager.getMultiWindowPage().switchBackToOriginalWindow();
});

Then(
  /^the user should see the title "([^"]*)" in the original window$/,
  async ({}, args1: string) => {
    await pageManager.getMultiWindowPage().verifyOriginalWindowTitle(args1);
  }
);

Then(
  /^the user should see the content of the original page unchanged$/,
  async () => {
    console.log("Verifying original window content remains unchanged");
    await pageManager
      .getMultiWindowPage()
      .verifyOriginalWindowContent("Opening a new window");
  }
);
