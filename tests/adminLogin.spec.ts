import { test, expect } from "@playwright/test";
import userData from "../utils/userData"; // adjust the path if needed

const baseUrl = userData.baseUrl;

test("Login as Super Admin", async ({ page }) => {
  const { mobileNumber, password } = userData.userDetails.superAdmin;

  await page.goto(baseUrl);
  await page.getByRole("textbox", { name: "Mobile Number" }).fill(mobileNumber);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL(`${baseUrl}/bbUser/users`, { timeout: 5000 });
  await expect(page).toHaveURL(`${baseUrl}/bbUser/users`);
});
