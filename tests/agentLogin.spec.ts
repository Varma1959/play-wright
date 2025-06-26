import { test, expect } from "@playwright/test";
import userData from "../utils/userData"; // adjust the path if needed

const baseUrl = userData.baseUrl;

test("Login as agent1", async ({ page }) => {
  const { mobileNumber, password } = userData.userDetails.agents.agent1;

  await page.goto(baseUrl);
  await page.getByRole("textbox", { name: "Mobile Number" }).fill(mobileNumber);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();

  await page.waitForURL(`${baseUrl}/agent/dashboard`, { timeout: 5000 });
  await expect(page).toHaveURL(`${baseUrl}/agent/dashboard`);
});

test("Login as agent2", async ({ page }) => {
  const { mobileNumber, password } = userData.userDetails.agents.agent2;

  await page.goto(baseUrl);
  await page.getByRole("textbox", { name: "Mobile Number" }).fill(mobileNumber);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();

  await page.waitForURL(`${baseUrl}/agent/dashboard`, { timeout: 5000 });
  await expect(page).toHaveURL(`${baseUrl}/agent/dashboard`);
});
