require("dotenv").config();
const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("./Utils/APIUtils");
const { POManager } = require("../pageObject/POManager");

const EMAIL = process.env.EVENTHUB_EMAIL;
const PASSWORD = process.env.EVENTHUB_PASSWORD;

const loginPayLoad = { email: EMAIL, password: PASSWORD };

let tokenLogin;

test.beforeAll(async () => {
  const apiContext = await request.newContext();

  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  tokenLogin = await apiUtils.getToken();
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("eventhub_token", value);
  }, tokenLogin);

  await page.goto("https://eventhub.rahulshettyacademy.com/");

  //await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();
});

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

test("User can login through the UI", async ({ page }) => {
  const poManager = new POManager(page);
  const eventLoginPage = poManager.getEventhubLoginPage();

  await eventLoginPage.goTo();
  await eventLoginPage.login(EMAIL, PASSWORD);

  await expect(eventLoginPage.eventPage).toBeVisible();
});

test("Creating event and Booking of Event feature", async ({ page }) => {
  const poManager = new POManager(page);
  const eventhubHomePage = poManager.getEventhubHomePage();
  const eventManagePage = poManager.getEventhubManageEvent();
  const eventPage = poManager.getEventhubEventPage();
  const eventBookingPage = poManager.getEventBookingPage();

  //Nagigating to Admin -> Events
  await eventhubHomePage.navigateToAdminManageEvent();

  //Creating an Event
  const eventTitle = await eventManagePage.fillingEventForm(
    "Samay Ka Show",
    "Noida",
    "ToyBoy",
    7,
    4500,
    500,
  );

  await eventManagePage.addEventButton();

  await expect(page.getByText("Event created!")).toBeVisible();

  //Going to Event page
  await eventManagePage.eventPageButton();

  await expect(eventPage.eventPageItems.first()).toBeVisible();

  const MatchedEventCard = eventPage.eventPageItems.filter({
    hasText: eventTitle,
  });

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
  expect(eventBookingPage.ticketLocator).toHaveText("1");

  await eventBookingPage.bookingFill(
    "Sandip Kumar",
    "sandip.kumar@gmail.com",
    "9102309317",
  );

  //Verify booking confirmation
  await expect(eventBookingPage.bookingConfirmLocator).toBeVisible();

  //Storing booking ref id
  const bookingRef = await eventBookingPage.bookingRef.textContent();

  await eventBookingPage.bookingDone();

  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );

  //My Booking Page
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
  await expect(eventPage.eventPageItems.first()).toBeVisible();
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
  //Booking first event with one ticket

  const poManager = new POManager(page);
  const eventHomePage = poManager.getEventhubHomePage();
  const eventBookingPage = poManager.getEventBookingPage();
  const myBookingPage = poManager.getMyBookingPage();
  const viewBookingPage = poManager.getViewBookingPage();

  // Clicking book now for first event
  await eventHomePage.bookFirstEvent();

  //Filling details on booking page
  //By default ticket should be 1
  expect(eventBookingPage.ticketLocator).toHaveText("1");

  await eventBookingPage.bookingFill(
    "Rahul",
    "rahulraj@gmail.com",
    "8757432510",
  );

  //Verify booking confirmation
  await expect(eventBookingPage.bookingConfirmLocator).toBeVisible();

  //Navigating to My Booking page
  await eventBookingPage.bookingDone();

  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );

  //Clicking the first View Details link
  await myBookingPage.firstViewDetail();

  //View Deatail page
  await expect(viewBookingPage.customeDetailsLocator).toBeVisible();

  //Storing Booking ref to a varibale
  const bookingRef = await viewBookingPage.bookingRefText();

  //Storing event title to a varibale
  const eventTitle = await viewBookingPage.eventTitleText();

  //First character of booking ref equals first character of event title
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  //Check refund eligibility
  await viewBookingPage.refund();
  await viewBookingPage.verifyRefundResult(
    "Eligible for refund.",
    "Single-ticket bookings qualify for a full refund.",
  );
});

test("Group ticket booking is NOT eligible for refund", async ({ page }) => {
  // Clicking book now for first event
  const poManager = new POManager(page);
  const eventHomePage = poManager.getEventhubHomePage();
  const eventBookingPage = poManager.getEventBookingPage();
  const myBookingPage = poManager.getMyBookingPage();
  const viewBookingPage = poManager.getViewBookingPage();

  await eventHomePage.bookFirstEvent();

  //Filling details on booking page

  //By default ticket should be 1 so will change it for group by clicking +
  await eventBookingPage.addMoreButton(3);

  expect(eventBookingPage.ticketLocator).toHaveText("3");

  await eventBookingPage.bookingFill("Ayush", "ayush@gmail.com", "1234567898");

  //Verify booking confirmation
  await expect(eventBookingPage.bookingConfirmLocator).toBeVisible();

  //Navigating to My Booking page
  await eventBookingPage.bookingDone();

  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );

  //Clicking the first View Details link
  await myBookingPage.firstViewDetail();

  await expect(viewBookingPage.customeDetailsLocator).toBeVisible();

  //Storing Booking ref to a varibale
  const bookingRef = await viewBookingPage.bookingRefText();

  //Storing event title to a varibale
  const eventTitle = await viewBookingPage.eventTitleText();

  //First character of booking ref equals first character of event title
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  //Check refund eligibility
  await viewBookingPage.refund();
  await viewBookingPage.verifyRefundResult(
    "Not eligible for refund.",
    "Group bookings (3 tickets) are non-refundable.",
  );
});
