// @ts-check
import { chromium, defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 40000,
  reporter: "html",
  expect: { timeout: 5000 },
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    browserName: "chromium",
    headless: false,
    screenshot: 'on',
    trace:'retain-on-failure',
  },
});