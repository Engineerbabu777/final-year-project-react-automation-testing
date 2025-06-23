import test, { expect } from "@playwright/test";

const UI_URL = "http://localhost:5174/";
const EMAIL = "static.user@gmail.com";
const PASSWORD = "password123";

let hotelName = "";

test.describe("Hotel Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);
    await page.getByRole("link", { name: "Sign In" }).click();
    await page.locator('[name="email"]').fill(EMAIL);
    await page.locator('[name="password"]').fill(PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(/success/i)).toBeVisible();
  });

  test("should add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`);

    hotelName = `Dublin Getaways ${Date.now()}`;
    await page.locator('[name="name"]').fill(hotelName);
    await page.locator('[name="city"]').fill("Dublin");
    await page.locator('[name="country"]').fill("Ireland");
    await page
      .locator('[name="description"]')
      .fill("Lorem ipsum dolor sit amet");
    await page.locator('[name="pricePerNight"]').fill("119");
    await page.selectOption('select[name="starRating"]', "2");

    await page.getByText("All Inclusive").click();
    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();
    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("3");

    await page.setInputFiles('[name="imageFiles"]', [
      "tests/files/1.png",
      "tests/files/2.png",
    ]);

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Hotel Saved")).toBeVisible();
  });

  test("should display added hotel", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`);

    await expect(page.getByText(hotelName)).toBeVisible();
  });
});
