# EventHub E2E Test Automation (Playwright)

End-to-end UI test suite for [EventHub](https://eventhub.rahulshettyacademy.com) — a demo event booking platform — built with **Playwright** and **JavaScript**. The suite covers event creation, ticket booking, and refund-eligibility business rules across the full user journey.

## Tech Stack

- **Playwright Test** (`@playwright/test`)
- **JavaScript (Node.js)**
- **dotenv** for credential management

## What's Covered

### `EventHubE2ETest.spec.js`

**1. Creating an event and booking it (full lifecycle)**
- Logs in as an admin
- Navigates to *Manage Events* and creates a new event with a unique title, description, city, venue, future date/time, price, and seat count
- Verifies the event appears on the public events page
- Books 1 ticket for the newly created event
- Verifies the booking confirmation and booking reference
- Cross-checks the booking appears correctly under *My Bookings*
- Asserts the event's available seat count decreases by exactly 1 after booking

**2. Single-ticket booking refund eligibility**
- Books 1 ticket for an event
- Opens the booking details and validates the booking reference against the event title
- Triggers the refund-eligibility check
- Asserts the result: **"Eligible for refund" — single-ticket bookings qualify for a full refund**

**3. Group-ticket booking refund eligibility**
- Increases ticket quantity to 3 via the quantity selector before booking
- Confirms the booking and opens its details
- Triggers the refund-eligibility check
- Asserts the result: **"Not eligible for refund" — group bookings (3 tickets) are non-refundable**

## Key Automation Techniques Demonstrated

- Reusable `login()` helper shared across tests
- Dynamic test data generation (unique event titles via `Date.now()`, future dates via a custom date helper)
- Locator strategies: role-based (`getByRole`), label-based (`getByLabel`), test-id based (`getByTestId`), and CSS
- Web-first assertions with `expect(...).toBeVisible()` / `toContainText()`
- State verification across pages (seat count before/after booking, booking reference cross-referenced between pages)
- Environment-based credential management (no secrets committed to source control)

## Project Structure

```
Playwright_Playground/
├── tests/
│   ├── EventHubE2ETest.spec.js
│   └── RSClientE2E.spec.js
├── playwright.config.js
├── package.json
├── .env.example
└── .gitignore
```

## Setup & Running Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd Playwright_Playground

# 2. Install dependencies
npm install
npx playwright install

# 3. Configure credentials
cp .env.example .env
# then edit .env with your own EventHub test account credentials

# 4. Run the tests
npx playwright test

# Run in headed mode to watch the browser
npx playwright test --headed

# View the HTML report after a run
npx playwright show-report
```

## Notes

This project was built as a hands-on E2E testing exercise against the [Rahul Shetty Academy EventHub](https://eventhub.rahulshettyacademy.com) practice site, covering realistic scenarios: event creation, booking flows, and conditional business logic (refund rules based on ticket quantity).
