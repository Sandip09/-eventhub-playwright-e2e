class EventhubLoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.eventPage = page.getByRole("link", { name: "Browse Events →" })
  }

  async goTo() {
    await this.page.goto("https://eventhub.rahulshettyacademy.com/login");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}

module.exports = { EventhubLoginPage };
