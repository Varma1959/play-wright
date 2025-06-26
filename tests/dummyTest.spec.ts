import { test, expect } from "@playwright/test";
import data from "../test-data/dummyData.json";

type Field = {
  name: string;
  value: string;
  //   value?: string;
  type: "placeholder" | "submit" | "xpath" | "css";
  selector?: string;
};

type Validation = {
  selector: string;
  expectedText: string;
};

type RegisterData = {
  baseUrl: string;
  fields: Field[];
  validations?: Validation[];
};

const registerData = data as RegisterData;

// ✅ Destructure fields into clearly named variables
const [
  firstNameField,
  lastNameField,
  mobileField,
  passwordField,
  confirmPasswordField,
  submitField,
] = registerData.fields;

test("Register using JSON data without loops", async ({ page }) => {
  await page.goto(registerData.baseUrl);

  // First Name
  const firstNameInput = page.getByPlaceholder(firstNameField.name);
  console.log("firstNameField.name:", firstNameField.name);
  await expect(firstNameInput).toBeVisible();
  await firstNameInput.fill(firstNameField.value);
  //await firstNameInput.fill(firstNameField.value ?? "");
  //   This is nullish coalescing operator: ??  if it's defined (not null or undefined); otherwise, use an empty string ("").”

  // confirmPasswordField.value = "test"
  // confirmPasswordField.value ?? "" = "test"

  // confirmPasswordField.value = undefined
  // confirmPasswordField.value ?? "" = "" (safe)

  // Last Name
  const lastNameInput = page.locator(`xpath=${lastNameField.selector}`);
  await expect(lastNameInput).toBeVisible();
  await lastNameInput.fill(lastNameField.value ?? "");

  // Mobile Number
  const mobileInput = page.getByPlaceholder(mobileField.name);
  await expect(mobileInput).toBeVisible();
  await mobileInput.fill(mobileField.value);

  // Password
  const passwordInput = page.getByPlaceholder(passwordField.name);
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(passwordField.value);

  // Confirm Password
  const confirmInput = page.locator('[name="confirmPassword"]');
  await expect(confirmInput).toBeVisible();
  await confirmInput.fill(confirmPasswordField.value);

  // Submit Button
  const submitButton = page.getByRole("button", { name: submitField.name });
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // Validation
  const [mobileValidation] = registerData.validations ?? [];
  //   Safely get the first validation rule from the list. If the list doesn’t exist, just assign undefined.
  if (mobileValidation) {
    const errorElement = page.locator(mobileValidation.selector);
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toHaveText(mobileValidation.expectedText);
  }
});
