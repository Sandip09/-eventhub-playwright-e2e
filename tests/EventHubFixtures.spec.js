const { test, expect, BASE_URL } = require("./Utils/fixtures");

test("API-created event is visible on events page", async ({
  authenticatedPage,
  createEvent,
}) => {
  await authenticatedPage.goto(`${BASE_URL}/events`);
  await expect(authenticatedPage.getByText(createEvent.title)).toBeVisible();
});
