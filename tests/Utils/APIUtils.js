class APIUtils {
  constructor(apiContext, loginPayLoad) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
      { data: this.loginPayLoad },
    );

    //Storing the response in json
    const loginResponseJson = await loginResponse.json();
    const tokenLogin = loginResponseJson.token;
    return tokenLogin;
  }

  async getEvents(token) {
    const eventsResponse = await this.apiContext.get(
      "https://api.eventhub.rahulshettyacademy.com/api/events",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const eventsJson = await eventsResponse.json();

    return { response: eventsResponse, json: eventsJson };
  }

  async createBooking(token, bookingPayload) {
    const bookingResponse = await this.apiContext.post(
      "https://api.eventhub.rahulshettyacademy.com/api/bookings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: bookingPayload,
      },
    );

    const bookingJson = await bookingResponse.json();

    return { response: bookingResponse, json: bookingJson };
  }

  async createEvent(token, eventData) {
    const response = await this.apiContext.post(
      "https://api.eventhub.rahulshettyacademy.com/api/events",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: eventData,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Create event failed: ${response.status()} ${await response.text()}`,
      );
    }
    return await response.json();
  }
}

module.exports = { APIUtils };
