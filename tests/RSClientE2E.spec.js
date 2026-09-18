const { test, expect } = require("@playwright/test");

test.skip("E2E Automation for Registration", async ({ page }) => {
  const email = "Payal01@gmail.com";
  const password = "Raandip@123";

  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  await page.locator(".btn1").click();

  //Registration Form
  await page.locator("#firstName").fill("Payal");
  await page.locator("#lastName").fill("Kumari");
  await page.locator("#userEmail").fill(email);
  await page.locator("#userMobile").fill("1234577991");
  await page.locator("#userPassword").fill(password);
  await page.locator("#confirmPassword").fill(password);
  await page.locator("[type='checkbox']").check();
  await page.locator("#login").click();

  // Assertion to check, registration completed.
  await expect(page.locator(".headcolor")).toHaveText(
    "Account Created Successfully",
  );

  await page.locator(".btn.btn-primary").click();

  //Login
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").fill(password);
  await page.locator("#login").click();

  // waitFor() method: wait until all the elemets are visible
  await page.locator(".card-body h5 b ").first().waitFor();
  console.log(await page.locator(".card-body h5 b ").allTextContents());
});

test("E2E Flow of the application", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

  const email = "sandip123@gmail.com";
  const password = "Sandip@123";
  const products = page.locator(".card-body");
  //const productName = "ZARA COAT 3";

  //Login
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").fill(password);
  await page.locator("#login").click();

  await page.locator(".card-body h5 b ").first().waitFor();

  // Add to cart "Zara Coat 3" product
  // Loop through products until you found your desired product - dynamic searching
  for (let i = 0; i < (await products.count()); i++) {
    const productName = await products.nth(i).locator("h5 b").textContent();

    if (productName.trim() === "ZARA COAT 3") {
      await products.nth(i).locator("text=Add To Cart").click();
      break;
    }
  }
  // CLicking on cart button
  await page.locator("[routerlink*='cart']").click();

  // waitFor page to load
  await page.locator("div li").first().waitFor();

  //Check our desired product is added to cart on Cart page
  const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
  expect(bool).toBeTruthy();

  //Checkout
  await page.locator("text=Checkout").click();

  //Checkout Page

  //Expiry date
  const dropdown = page.locator("select.ddl");

  await dropdown.nth(0).selectOption("04"); // selecting month 4 from dropdown
  await dropdown.nth(1).selectOption("24"); // selecting day 24 from dropdown

  // CVV CODE
  /*
  await page.locator("//div[@class='title'][contains(text(),'CVV Code')]/following-sibling::input").fill("711");

  //name
  await page.locator("//div[@class='field'][contains(text(),'Name on Card')]/following-sibling::input").fill("Sandip Sinha");
  */
  async function fillFieldByLabel(page, labelText, value) {
    await page
      .locator(
        `//div[@class='title'][contains(text(),'${labelText}')]/following-sibling::input`,
      )
      .fill(value);
  }

  // Usage:
  await fillFieldByLabel(page, "Name on Card", "Sandip Kumar");
  await fillFieldByLabel(page, "CVV Code", "711");

  // Country name - Dynamic dropdown
  await page.locator("[placeholder*='Country']").pressSequentially("ind");

  const dynamicDrop = page.locator(".ta-results");
  await dynamicDrop.waitFor();
  const optionCount = await dynamicDrop.locator("button").count();

  for (let i = 0; i < optionCount; i++) {
    const text = await dynamicDrop.locator("button").nth(i).textContent();
    if (text === " India") {
      await dynamicDrop.locator("button").nth(i).click();
      break;
    }
  }

  expect(page.locator(".user__name [type='text']").first()).toHaveText(email);

  await page.locator(".action__submit").click();

  await page.locator(".hero-primary").waitFor();

  expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

  //extract the order id and print it
  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);

  // Order page
  await page.locator("button[routerlink*='myorders']").click();

  await page.locator("tbody").waitFor();

  const tableLoc = await page.locator("tbody tr");

  for (let i = 0; i < (await tableLoc.count()); i++) {
    const rowOrderId = await tableLoc.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await tableLoc.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetail = await page.locator(".col-text").textContent();
  expect(orderId.includes(orderIdDetail)).toBeTruthy();
});