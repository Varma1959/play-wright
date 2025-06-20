import { expect, test } from "@playwright/test";

test.describe("Lead", () => {
  test("test", async ({ page }) => {
    await page.goto("https://app.realtor.works/login");

    
    // await page.getByPlaceholder("Enter Mobile Number").click();
    // await page.getByPlaceholder("Enter Mobile Number").fill("9000223107");
    // await page
    //   .locator("div")
    //   .filter({ hasText: /^Password$/ })
    //   .click();
    // await page.getByPlaceholder("Enter Password").fill("test");
    // await page.getByPlaceholder("Enter Password").press("Enter");
    // await page.getByRole("button", { name: "Log In" }).click();
    await page.getByRole("link", { name: " Contacts" }).click();
    await page.getByText("(Showing 1 to 10 of 822 Contacts)New").click();
    await page.getByRole("button", { name: " New" }).click();
    await page.getByLabel("First Name").click();
    await page.getByLabel("First Name").fill("varma");
    await page.getByLabel("Primary Contact Number").click();
    await page.getByLabel("Primary Contact Number").fill("9949177888");
    await page.getByRole("button", { name: "Save" }).click();
  });
});
