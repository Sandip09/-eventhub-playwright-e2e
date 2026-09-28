require("dotenv").config();
const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("./Utils/APIUtils");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

const YAHOO_USER = {
  email: process.env.YAHOO_EMAIL,
  password: process.env.YAHOO_PASSWORD,
};

const GMAIL_USER = {
  email: process.env.EVENTHUB_EMAIL,
  password: process.env.EVENTHUB_PASSWORD,
};

let yahooBookingId;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, YAHOO_USER);

  // Step 1: login as Yahoo user via API
  const yahooToken = await apiUtils.getToken();
  expect(yahooToken).toBeTruthy();

  // Step 2: fetch events, get a valid eventId
  const { response: eventsRes, json: eventsJson } =
    await apiUtils.getEvents(yahooToken);
  expect(eventsRes.ok()).toBeTruthy();
  const eventId = eventsJson.data[0].id;

  // Step 3: create a booking as Yahoo user
  const bookingPayload = {
    eventId: eventId,
    customerName: "Yahoo User",
    customerEmail: YAHOO_USER.email,
    customerPhone: "9876543210",
    quantity: 1,
  };

  const { response: bookingRes, json: bookingJson } =
    await apiUtils.createBooking(yahooToken, bookingPayload);
  expect(bookingRes.ok()).toBeTruthy();
  yahooBookingId = bookingJson.data.id;
});

async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();
}

test("Gmail user cannot view Yahoo user's booking", async ({ page }) => {
  // Step 4: login as Gmail user via the browser UI
  await loginAs(page, GMAIL_USER);

  // Step 5: open Yahoo's booking URL directly
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {
    waitUntil: "networkidle",
  });

  // Step 6: validate access is denied
  await expect(page.getByText("Access Denied")).toBeVisible();
  await expect(
    page.getByText("You are not authorized to view this booking"),
  ).toBeVisible();
});
