class EventhubEventPage{
    constructor(page){
        this.page = page;
        this.eventPageItems = page.locator("[data-testid='event-card']")
    }
}

module.exports = {EventhubEventPage}