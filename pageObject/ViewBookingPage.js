const { expect } = require("@playwright/test");

class ViewBookingPage {
  constructor(page) {
    this.page = page;
    this.customeDetailsLocator = page.getByRole("heading", {
      name: "Customer Details",
    });
    this.bookingRef = page.locator("span.font-mono.text-indigo-600");
    this.eventTitle = page.locator("h1.text-gray-900");
    this.refundButton = page.locator("[data-testid='check-refund-btn']");
    this.refundTextLocator = page.locator("#refund-result");
  }

  async bookingRefText() {
    const bookingRefText = await this.bookingRef.textContent();
    return bookingRefText.trim();
  }

  async eventTitleText() {
    const eventTitleText = await this.eventTitle.textContent();
    return eventTitleText.trim();
  }

  async refund() {
    await this.refundButton.click();
  }

  async verifyRefundResult(statusText, detailText) {
    await expect(this.refundTextLocator).toBeVisible();
    await expect(this.refundTextLocator).toContainText(statusText);
    await expect(this.refundTextLocator).toContainText(detailText);
  }
}

module.exports = { ViewBookingPage };
