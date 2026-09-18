require("dotenv").config();
const { test, expect, request } = require("@playwright/test");

const EMAIL = process.env.EVENTHUB_EMAIL;
const PASSWORD = process.env.EVENTHUB_PASSWORD;

const loginPayLoad = { email: EMAIL, password: PASSWORD };

let tokenLogin;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  //Posting a API call and storing the response
  const loginResponse = await apiContext.post(
    "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
    { data: loginPayLoad },
  );

  //Asserting API call success
  expect(loginResponse.ok()).toBeTruthy();

  //Storing the response in json
  const loginResponseJson = await loginResponse.json();
  tokenLogin = loginResponseJson.token;
  console.log(tokenLogin);
});

test.beforeEach(async ({page}) => {
    await page.addInitScript((value) => {
    window.localStorage.setItem("eventhub_token", value);
  }, tokenLogin);

  await page.goto("https://eventhub.rahulshettyacademy.com/");

  //await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();

});

/*async function login(page, email, password) {
  await page.goto("https://eventhub.rahulshettyacademy.com/login");

  await page.getByLabel("Email").fill(email);

  await page.getByLabel("Password").fill(password);

  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForLoadState("networkidle");
}*/

function futureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // datetime-local inputs require: YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

test.skip("New Registration on Events hub page", async ({ page }) => {
  await page.goto("https://eventhub.rahulshettyacademy.com");
  await page.getByText("Register").click();
  await page.getByPlaceholder("you@email.com").fill("email");
  await page
    .getByPlaceholder("Min 8 chars, uppercase, number & symbol")
    .fill(password);
  await page.getByPlaceholder("Repeat your password").fill(password);
  await page.locator("#register-btn").click();
});

test("Creating event and Booking of Event feature", async ({ page }) => {
  //await login(page, EMAIL, PASSWORD);
  /*await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();*/

  //Nagigating to Admin -> Events
  await page.getByRole("button", { name: "Admin" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Manage Events" })
    .click();

  //Creating an Event
  //Generating a unique event title
  const eventTitle = `Test Event ${Date.now()}`;

  await page.locator("#event-title-input").fill(eventTitle);
  await page
    .getByRole("textbox", { name: "Describe the event…" })
    .fill("Samay Shows");
  await page.getByLabel("city").fill("Patna");
  await page.getByLabel("venue").fill("Gandhi Maidan");

  // Fill future date and time
  const futureDate = futureDateValue();
  await page.getByLabel("Event Date & Time").fill(futureDate);

  // Filling price
  await page.getByRole("spinbutton", { name: "Price ($)*" }).fill("5000");

  //seat
  await page.getByRole("spinbutton", { name: "Total Seats*" }).fill("100");

  await page.getByTestId("add-event-btn").click();

  await expect(page.getByText("Event created!")).toBeVisible();

  //Going to Event page
  await page.locator("#nav-events").click();

  const eventCard = page.locator("[data-testid='event-card']");
  await expect(eventCard.first()).toBeVisible();

  const MatchedEventCard = eventCard.filter({ hasText: eventTitle });

  await expect(MatchedEventCard).toBeVisible();

  //Extracting seat count before booking
  const seatText = await MatchedEventCard.locator(
    "span.text-emerald-600",
  ).textContent();

  // seatsText will be something like "100 seats available"
  const seatBeforeBooking = parseInt(seatText.trim().match(/\d+/)[0], 10);

  //Booking for matched event card
  await MatchedEventCard.locator("[data-testid='book-now-btn']").click();

  //Booking form filling
  //By default ticket should be 1
  expect(page.locator("#ticket-count")).toHaveText("1");

  await page.locator("#customerName").fill("Rahul Kumar");
  await page.locator("#customer-email").fill("rahulraj@gmail.com");
  await page.getByPlaceholder("+91 98765 43210").fill("+91 6202209178");
  await page.locator("#confirm-booking").click();

  //Verify booking confirmation
  await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible();

  //Storing booking ref id
  const bookingRef = await page.locator(".booking-ref").textContent();

  await page.getByRole("button", { name: "View My Bookings" }).click();

  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );

  const bookingCards = page.locator("#booking-card");
  await expect(bookingCards.first()).toBeVisible();

  // Assertion to check our booking ref is present
  await expect(bookingCards.filter({ hasText: bookingRef })).toBeVisible();

  // Assertion to check booking ref has same event title that we added
  await expect(bookingCards.filter({ hasText: bookingRef })).toContainText(
    eventTitle,
  );

  //Navigating back to home
  await page.locator("[data-testid='nav-home']").click();
  await expect(eventCard.first()).toBeVisible();
  await expect(MatchedEventCard).toBeVisible();

  //Extracting seat count after booking
  const seatTextAfter = await MatchedEventCard.locator(
    "span.text-emerald-600",
  ).textContent();

  // seatTextAfter will be something like "99 seats available"
  const seatAfterBooking = parseInt(seatTextAfter.trim().match(/\d+/)[0], 10);

  // Assertion to check seat after booking reduced by 1
  expect(seatAfterBooking).toBe(seatBeforeBooking - 1);
});

test("Single ticket booking is eligible for refund", async ({ page }) => {
  /*await login(page, EMAIL, PASSWORD);
  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();*/

  //Booking first event with one ticket
  await page.locator("[data-testid='nav-home']").click();

  // Clicking book now for first event
  const eventCard = page.locator("[data-testid='event-card']");
  await eventCard.first().locator("#book-now-btn").click();

  //Filling details on booking page
  //By default ticket should be 1
  expect(page.locator("#ticket-count")).toHaveText("1");

  await page.locator("#customerName").fill("Pranva Kumar");
  await page.locator("#customer-email").fill("pranav69@gmail.com");
  await page.getByPlaceholder("+91 98765 43210").fill("+91 6872209178");
  await page.locator("#confirm-booking").click();

  //Verify booking confirmation
  await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible();

  //Navigating to My Booking page
  await page.getByRole("button", { name: "View My Bookings" }).click();

  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );

  //Clicking the first View Details link
  await page.getByRole("button", { name: "View Details" }).first().click();

  await expect(
    page.getByRole("heading", { name: "Customer Details" }),
  ).toBeVisible();

  //Storing Booking ref to a varibale
  const bookingRefText = await page
    .locator("span.font-mono.text-indigo-600")
    .textContent();

  const bookingRef = bookingRefText.trim();

  //Storing event title to a varibale
  const eventTitleText = await page.locator("h1.text-gray-900").textContent();

  const eventTitle = eventTitleText.trim();

  //First character of booking ref equals first character of event title
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  //Check refund eligibility
  await page.locator("[data-testid='check-refund-btn']").click();

  //Refund text assertion
  const refundBox = page.locator("#refund-result");
  await expect(refundBox).toBeVisible();
  await expect(refundBox).toContainText("Eligible for refund.");
  await expect(refundBox).toContainText(
    " Single-ticket bookings qualify for a full refund.",
  );
});

test("Group ticket booking is NOT eligible for refund", async ({ page }) => {
  /*await login(page, EMAIL, PASSWORD);
  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();*/

  await page.locator("[data-testid='nav-home']").click();

  // Clicking book now for first event
  const eventCard = page.locator("[data-testid='event-card']");
  await eventCard.first().locator("#book-now-btn").click();

  //Filling details on booking page
  //By default ticket should be 1 so will change it for group by clicking +
  const addMore = page.getByRole("button", { name: "+" });

  //1st click
  await addMore.click();
  //2nd click
  await addMore.click();

  expect(page.locator("#ticket-count")).toHaveText("3");

  await page.locator("#customerName").fill("Pranva Kumar");
  await page.locator("#customer-email").fill("pranav69@gmail.com");
  await page.getByPlaceholder("+91 98765 43210").fill("+91 6872209178");
  await page.locator("#confirm-booking").click();

  //Verify booking confirmation
  await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible();

  //Navigating to My Booking page
  await page.getByRole("button", { name: "View My Bookings" }).click();

  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );

  //Clicking the first View Details link
  await page.getByRole("button", { name: "View Details" }).first().click();

  await expect(
    page.getByRole("heading", { name: "Customer Details" }),
  ).toBeVisible();

  //Storing Booking ref to a varibale
  const bookingRefText = await page
    .locator("span.font-mono.text-indigo-600")
    .textContent();

  const bookingRef = bookingRefText.trim();

  //Storing event title to a varibale
  const eventTitleText = await page.locator("h1.text-gray-900").textContent();

  const eventTitle = eventTitleText.trim();

  //First character of booking ref equals first character of event title
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  //Check refund eligibility
  await page.locator("[data-testid='check-refund-btn']").click();

  //Refund text assertion
  const refundBox = page.locator("#refund-result");
  await expect(refundBox).toBeVisible();
  await expect(refundBox).toContainText("Not eligible for refund.");
  await expect(refundBox).toContainText(
    "Group bookings (3 tickets) are non-refundable.",
  );
});