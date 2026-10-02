class EventhubHomePage {
  constructor(page) {
    this.page = page;
    this.adminButton = page.getByRole("button", { name: "Admin" });
    this.manageEventButton = page
      .getByRole("navigation")
      .getByRole("link", { name: "Manage Events" });
    this.firstEventLocator = page.locator("[data-testid='event-card']").first();
    this.firstEventBookButton = this.firstEventLocator.locator("#book-now-btn");
  }

  async navigateToAdminManageEvent() {
    await this.adminButton.click();
    await this.manageEventButton.click();
  }

  async bookFirstEvent() {
    await this.firstEventBookButton.click();
  }
}

module.exports = { EventhubHomePage };
