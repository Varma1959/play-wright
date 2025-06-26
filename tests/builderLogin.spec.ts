import { test, expect } from "@playwright/test";
import userJson from "../test-data/user.json";

type FieldType = {
  name: string;
  type: string;
};

type BuilderLogin = {
  mobileNumber: string;
  password: string;
};

type UserData = {
  baseUrl: string;
  fields: FieldType[];
  userDetails: {
    builders: {
      [key: string]: BuilderLogin;
    };
  };
};

const userData = userJson as UserData;

test("Login as agent1 using dynamic field selectors", async ({ page }) => {
  const { mobileNumber, password } = userData.userDetails.builders.builder1;
  const { baseUrl, fields } = userData;

  await page.goto(baseUrl);

  // ✅ Mobile field
  const mobileField = fields.find(
    (f) => f.name === "Enter Mobile Number" && f.type === "placeholder"
  );
  if (mobileField) {
    const input = page.getByPlaceholder(mobileField.name);
    await expect(input).toBeVisible();
    await input.fill(mobileNumber);
  }

  // ✅ Password field
  const passwordField = fields.find(
    (f) => f.name === "Enter Password" && f.type === "placeholder"
  );
  if (passwordField) {
    const passwordInput = page.getByPlaceholder(passwordField.name);
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);
  }

  // ✅ Log In button
  const loginButton = fields.find(
    (f) => f.name === "Log In" && f.type === "submit"
  );
  if (loginButton) {
    const button = page.getByRole("button", { name: loginButton.name });
    await expect(button).toBeVisible();
    await button.click();
  }

  await page.waitForURL(`${baseUrl}/builder/dashboard`, { timeout: 5000 });
  await expect(page).toHaveURL(`${baseUrl}/builder/dashboard`);
});
