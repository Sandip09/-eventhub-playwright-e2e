# EventHub – Sandbox Banner Visibility with API Mocking (Playwright)

Playwright test suite that verifies the **sandbox warning banner** on the [EventHub](https://eventhub.rahulshettyacademy.com) Events page. The banner should only appear when **more than 5 events** are loaded. Instead of depending on real data, the tests use Playwright's **network interception** to mock the events API.

## Tech Stack

- **Playwright Test** (`@playwright/test`)
- **JavaScript (Node.js)**
- **dotenv** for credential management

## What's Covered

### `SandboxBannerMock.spec.js`

**Test 1 – Banner IS visible when 6 events are returned**
- Registers a `page.route()` mock for `**/api/events` *before* navigation
- Fulfils the request with status `200`, `application/json`, and `SIX_EVENTS_RESPONSE`
- Logs in and navigates to `/events` using the `loginAndGoToEvents(page)` helper
- Asserts the first `event-card` is visible and the card count is exactly **6**
- Locates the banner with the case-insensitive regex `/sandbox holds up to/i`
- Asserts the banner is visible and contains the text **"9 bookings"**

**Test 2 – Banner is NOT visible when 4 events are returned**
- Same setup, but mocks the API with `FOUR_EVENTS_RESPONSE`
- Asserts the first card is visible and the card count is exactly **4**
- Asserts the banner is **not** visible

## Key Automation Techniques Demonstrated

- API mocking with `page.route()` and `route.fulfill()`
- Registering the mock **before** navigation so the first request is intercepted
- Reusable mock response constants (`SIX_EVENTS_RESPONSE`, `FOUR_EVENTS_RESPONSE`)
- Reusable `loginAndGoToEvents(page)` helper
- Testing a UI threshold rule (> 5 events) deterministically, with no dependency on backend data
- Regex-based text locators and web-first assertions (`toBeVisible`, `toHaveCount`, `toContainText`, `not.toBeVisible`)

## Project Structure

```
Playwright_Playground/
├── tests/
│   └── SandboxBannerMock.spec.js
├── playwright.config.js
├── package.json
├── .env.example
└── .gitignore
```

## Setup & Running Locally

```bash
# 1. Install dependencies
npm install
npx playwright install

# 2. Configure credentials
cp .env.example .env
# then edit .env with your EventHub test account credentials
#   EVENTHUB_EMAIL=...
#   EVENTHUB_PASSWORD=...

# 3. Run only this suite
npx playwright test tests/SandboxBannerMock.spec.js

# Headed mode / HTML report
npx playwright test tests/SandboxBannerMock.spec.js --headed
npx playwright show-report
```

## Notes

- `BASE_URL` = `https://eventhub.rahulshettyacademy.com`
- Because the API is mocked, the tests do not create or modify any real data.
- Credentials are read from `.env` (gitignored), never hard-coded.