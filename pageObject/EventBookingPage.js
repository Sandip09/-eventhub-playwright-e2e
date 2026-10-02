class EventBookingPage {
  constructor(page) {
    this.page = page;
    this.cutomerName = page.locator("#customerName");
    this.customerEmail = page.locator("#customer-email");
    this.customerNumber = page.getByPlaceholder("+91 98765 43210");
    this.button = page.locator("#confirm-booking");
    this.ticketLocator = page.locator("#ticket-count");
    this.bookingConfirmLocator = page.getByText("Booking Confirmed! 🎉");
    this.bookingRef = page.locator(".booking-ref");
    this.viewBookingButton = page.getByRole("button", {
      name: "View My Bookings",
    });
    this.addMoreLocatore = page.getByRole("button", { name: "+" });
  }

  async bookingFill(name, email, phone) {
    await this.cutomerName.fill(name);
    await this.customerEmail.fill(email);
    await this.customerNumber.fill(phone);

    await this.button.click();
  }

  async bookingDone() {
    await this.viewBookingButton.click();
  }

  async addMoreButton(n) {
    for (let i = 1; i <= n - 1; i++) {
      await this.addMoreLocatore.click();
    }
  }
}

module.exports = { EventBookingPage };
