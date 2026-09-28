# EventHub – Two-Fixture Test: Login Fixture + Event Creation Fixture (Playwright)

Demonstrates **Playwright custom fixtures** on [EventHub](https://eventhub.rahulshettyacademy.com). All the heavy lifting (UI login and API event creation) lives inside fixtures, so the **test body is just two lines**: a navigation and an assertion.

## Tech Stack

- **Playwright Test** (`@playwright/test`)
- **JavaScript (Node.js)**
- **dotenv** for credential management

## What's Covered

### Fixtures (`tests/fixtures/eventHubFixtures.js`)

**`authenticatedPage`**
- Opens `/login`, fills email and password through the **UI**, and clicks login
- Yields a `page` that is already past the login screen
- Any test using it can go straight to `/events` with no login steps

**`createEvent`**
- Calls `POST /api/events` directly (**no UI**) before the test runs
- Uses a unique event name (e.g. `Fixture Event ${Date.now()}`)
- Yields the **API response** (new event's name / ID) to the test

### Test (`tests/EventHubFixtures.spec.js`)

- Requests `authenticatedPage` and `createEvent`
- Navigates to `/events` (already logged in)
- Asserts the newly created event's name is visible on the page
- Contains **no login code and no API call** in the test body

## Key Automation Techniques Demonstrated

- Custom fixtures with `test.extend()`
- Fixture setup/teardown using `await use(...)`
- Combining a UI-driven fixture with an API-driven fixture
- Reading fixture output directly in the test (`createEvent.title` / `.id`)
- Unique test data generation to avoid collisions between runs
- Clean, readable tests through separation of setup and assertions

## API Reference

Swagger docs: <https://api.eventhub.rahulshettyacademy.com/api/docs/#/Events/post_events>

## Project Structure

```
Playwright_Playground/
├── tests/
│   ├── fixtures/
│   │   └── eventHubFixtures.js
│   └── EventHubFixtures.spec.js
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
npx playwright test tests/EventHubFixtures.spec.js

# Headed mode / HTML report
npx playwright test tests/EventHubFixtures.spec.js --headed
npx playwright show-report
```

## Notes

- Login page: `https://eventhub.rahulshettyacademy.com/login`
- The account used must have permission to create events via the API.
- Credentials live in `.env` (gitignored), never in source control.