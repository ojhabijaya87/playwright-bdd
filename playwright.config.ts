import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig, cucumberReporter } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "features/*.feature",
  steps: "features/steps/*.ts",
});

export default defineConfig({
  testDir,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 4, // Run multiple specs in parallel
  reporter: [
    ["line"], // Add a console line reporter for immediate output
    cucumberReporter("html", {
      outputFile: "cucumber-report/index.html",
      externalAttachments: true,
    }),
  ],
  use: {
    screenshot: "on",
    video: "on",
    trace: "on",
    // storageState: 'auth.json',
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
