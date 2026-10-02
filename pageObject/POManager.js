const { EventhubLoginPage } = require("./EventhubLoginPage");
const { EventhubHomePage } = require("./EventhubHomePage");
const { EventhubManageEventPage } = require("./EventhubManageEventPage");
const { EventhubEventPage } = require("./EventhubEventPage");
const { EventBookingPage } = require("./EventBookingPage");
const { MyBookingPage } = require("./MyBookigPage.js");
const { ViewBookingPage } = require("./ViewBookingPage");

class POManager {
  constructor(page) {
    this.page = page;
    this.eventhubLoginPage = new EventhubLoginPage(this.page);
    this.eventhubHomePage = new EventhubHomePage(this.page);
    this.eventhubManageEvent = new EventhubManageEventPage(this.page);
    this.eventhubEventPage = new EventhubEventPage(this.page);
    this.eventBookingPage = new EventBookingPage(this.page);
    this.myBookingPage = new MyBookingPage(this.page);
    this.viewBookingPage = new ViewBookingPage(this.page);
  }

  getEventhubLoginPage() {
    return this.eventhubLoginPage;
  }

  getEventhubHomePage() {
    return this.eventhubHomePage;
  }

  getEventhubManageEvent() {
    return this.eventhubManageEvent;
  }

  getEventhubEventPage() {
    return this.eventhubEventPage;
  }

  getEventBookingPage() {
    return this.eventBookingPage;
  }

  getMyBookingPage() {
    return this.myBookingPage;
  }

  getViewBookingPage() {
    return this.viewBookingPage;
  }
}

module.exports = { POManager };
