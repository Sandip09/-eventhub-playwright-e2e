# EventHub – Cross-User Booking Access Denied (Playwright)

Hybrid **API + UI** security test for [EventHub](https://eventhub.rahulshettyacademy.com). It verifies that one user **cannot view another user's booking** by opening its URL directly.

- **User A (Yahoo)** creates a booking through direct API calls (no browser UI).
- **User B (Gmail)** logs in through the browser and navigates straight to User A's booking URL.
- User B must see an **"Access Denied"** error.

## Tech Stack

- **Playwright Test** (`@playwright/test`)
- **JavaScript (Node.js)**
- **dotenv** for credential management

## What's Covered

### `CrossUserBookingAccess.spec.js`

**Step 1 – Login as Yahoo user (API)**
- `POST /api/auth/login` with `{ email, password }`
- Asserts `loginRes.ok()` and extracts the auth `token`

**Step 2 – Fetch a valid event ID (API)**
- `GET /api/events` with `Authorization: Bearer <token>`
- Asserts the response is OK and stores `data[0].id` as `eventId`

**Step 3 – Create a booking as Yahoo user (API)**
- `POST /api/bookings` with `eventId`, `customerName`, `customerEmail`, `customerPhone`, `quantity: 1`
- Asserts the response is OK and stores `data.id` as `yahooBookingId`

**Step 4 – Login as Gmail user (UI)**
- Uses the `loginAs(page, GMAIL_USER)` helper through the browser

**Step 5 – Open Yahoo's booking as Gmail user**
- Navigates directly to `/bookings/${yahooBookingId}` with `{ waitUntil: 'networkidle' }`

**Step 6 – Validate access is denied**
- Asserts **"Access Denied"** is visible
- Asserts **"You are not authorized to view this booking"** is visible

## Key Automation Techniques Demonstrated

- Mixing API setup with UI verification in one test
- Playwright's `request` fixture for authenticated API calls (Bearer token)
- Extracting and chaining values across API responses (`token` → `eventId` → `bookingId`)
- Reusable `loginAs(page, user)` helper for multi-user scenarios
- Authorization / access-control (IDOR-style) testing
- `networkidle` navigation so the page fully resolves before asserting

## API Reference

Swagger docs: <https://api.eventhub.rahulshettyacademy.com/api/docs/>

- `POST /api/auth/login`
- `GET /api/events`
- `POST /api/bookings`

## Project Structure

```
Playwright_Playground/
├── tests/
│   └── CrossUserBookingAccess.spec.js
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

# 2. Create two EventHub accounts (dummy emails are fine)
#    e.g. one Yahoo-style and one Gmail-style address

# 3. Configure credentials
cp .env.example .env
# then add:
#   YAHOO_EMAIL=...
#   YAHOO_PASSWORD=...
#   GMAIL_EMAIL=...
#   GMAIL_PASSWORD=...

# 4. Run only this suite
npx playwright test tests/CrossUserBookingAccess.spec.js

# Headed mode / HTML report
npx playwright test tests/CrossUserBookingAccess.spec.js --headed
npx playwright show-report
```

## Notes

- `BASE_URL` = `https://eventhub.rahulshettyacademy.com`, `API_URL` = `BASE_URL + /api`
- Both accounts must exist before running the test.
- Credentials live in `.env` (gitignored), never in source control.