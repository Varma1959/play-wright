import { test, expect } from "@playwright/test";
import userData from "../utils/userData";

type FieldType = {
  name: string;
  type: string;
};

const baseUrl = userData.baseUrl;
const fields: FieldType[] = userData.fields;

test("Login as agent1 using dynamic field selectors", async ({ page }) => {
  const { mobileNumber, password } = userData.userDetails.agents.agent1;

  await page.goto(baseUrl);

  const mobileField = fields.find(
    (f) => f.name === "Enter Mobile Number" && f.type === "placeholder"
  );
  if (mobileField) {
    const input = page.getByPlaceholder(mobileField.name);
    await expect(input).toBeVisible();
    await input.fill(mobileNumber);
  }

  const passwordField = fields.find(
    (f) => f.name === "Enter Password" && f.type === "placeholder"
  );
  if (passwordField) {
    const passwordInput = page.getByPlaceholder(passwordField.name);
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);
  }

  const loginButton = fields.find(
    (f) => f.name.includes("Log In") && f.type === "submit"
  );
  if (loginButton) {
    const button = page.getByRole("button", { name: loginButton.name });
    await expect(button).toBeVisible();
    await button.click();
  }

  await page.waitForURL(`${baseUrl}/agent/dashboard`, { timeout: 5000 });
  await expect(page).toHaveURL(`${baseUrl}/agent/dashboard`);
});
