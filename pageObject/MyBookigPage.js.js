class MyBookingPage {
  constructor(page) {
    this.page = page;
    this.firstEventViewDetailButton = page
      .getByRole("button", { name: "View Details" })
      .first();
  }

  async firstViewDetail(){
    await this.firstEventViewDetailButton.click();
  }
}
module.exports = { MyBookingPage };
