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
}

module.exports = {APIUtils}