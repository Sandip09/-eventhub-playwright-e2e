require("dotenv").config();
const base = require("@playwright/test");
const { APIUtils } = require("./APIUtils");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const EMAIL = process.env.EVENTHUB_EMAIL;
const PASSWORD = process.env.EVENTHUB_PASSWORD;

const test = base.test.extend({
  // Task 1: UI login
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();

    await base
      .expect(page.getByRole("link", { name: "Browse Events →" }))
      .toBeVisible();

    await use(page);
  },

  // Task 2: create an event through the API, no UI
  createEvent: async ({ request }, use) => {
    const apiUtils = new APIUtils(request, {
      email: EMAIL,
      password: PASSWORD,
    });
    const token = await apiUtils.getToken();

    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7);

    const payload = {
      title: `Fixture Event ${Date.now()}`,
      description: "Created by createEvent fixture",
      category: "Conference",
      venue: "Bangalore International Centre",
      city: "Bangalore",
      eventDate: eventDate.toISOString(),
      price: 1500,
      totalSeats: 100,
      imageUrl: "https://example.com/banner.jpg",
    };

    const body = await apiUtils.createEvent(token, payload);

    // Handle both { data: {...} } and a flat response
    const event = body.data ?? body;

    await use(event);
  },
});

module.exports = { test, expect: base.expect, BASE_URL };
