const { futureDateTimeLocalValue } = require("../tests/Utils/DateUtils");

class EventhubManageEventPage {
  constructor(page) {
    this.page = page;
    this.eventTitel = page.locator("#event-title-input");
    this.description = page.getByRole("textbox", {
      name: "Describe the event…",
    });
    this.city = page.getByLabel("city");
    this.venue = page.getByLabel("venue");
    this.eventDateTime = page.getByLabel("Event Date & Time");
    this.price = page.getByRole("spinbutton", { name: "Price ($)*" });
    this.seat = page.getByRole("spinbutton", { name: "Total Seats*" });
    this.addEventButtonLocator = page.getByTestId("add-event-btn");
    this.eventPageButtonLocator = page.locator("#nav-events");
  }

  async fillingEventForm(
    description,
    city,
    venue,
    daysFromNow = 7,
    price,
    seat,
  ) {
    //Generating a unique event title
    const eventTitle = `Test Event ${Date.now()}`;
    await this.eventTitel.fill(eventTitle);

    //Description
    await this.description.fill(description);

    await this.city.fill(city);
    await this.venue.fill(venue);

    await this.eventDateTime.fill(futureDateTimeLocalValue(daysFromNow));

    // Filling price
    await this.price.fill(String(price));

    //seat
    await this.seat.fill(String(seat));

    return eventTitle;
  }

  async addEventButton() {
    await this.addEventButtonLocator.click();
  }

  async eventPageButton() {
    await this.eventPageButtonLocator.click();
  }
}

module.exports = { EventhubManageEventPage };
