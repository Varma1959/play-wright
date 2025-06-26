import { test, expect } from "@playwright/test";
import data from "../test-data/registerData.json"; // imported as `data`

type Field = {
  name: string;
  value?: string; //The value property may or may not be present, and if it is, it must be a string.
  type: "placeholder" | "submit"; //is a string literal union type, and it's used when you want to strictly control the allowed values.
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
// Here we are using typescript assertion it is also called type cast.
//You're telling TypeScript:

//"I know that this imported data matches the structure defined in RegisterData, so treat it as that type."

test("Register using placeholder-based JSON data", async ({ page }) => {
  await page.goto(registerData.baseUrl);

  for (const field of registerData.fields) {
    if (field.type === "placeholder") {
      const input = page.getByPlaceholder(field.name);
      await expect(input).toBeVisible();
      await input.fill(field.value ?? ""); // safely handle optional value
    }

    if (field.type === "submit") {
      const button = page.getByRole("button", { name: field.name });
      await expect(button).toBeVisible();
      await button.click();
    }
  }
  // ✅ Assert validation messages if present
  if (registerData.validations) {
    for (const validation of registerData.validations) {
      const errorElement = page.locator(validation.selector);
      await expect(errorElement).toBeVisible();
      await expect(errorElement).toHaveText(validation.expectedText);
    }
  }
});
