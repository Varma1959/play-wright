import { test, expect } from "@playwright/test";
import userData from "../utils/userData";

type AgentCredentials = {
  mobileNumber: string;
  password: string;
};

type AgentUser = {
  name: string;
  mobileNumber: string;
  password: string;
};

const baseUrl = userData.baseUrl;
const agentEntries = Object.entries(userData.userDetails.agents) as [
  string,
  AgentCredentials
][];
const agents: AgentUser[] = agentEntries.map(([name, credentials]) => ({
  name,
  mobileNumber: credentials.mobileNumber,
  password: credentials.password,
}));

test.describe("Agent Login Tests (parameterized)", () => {
  agents.forEach(({ name, mobileNumber, password }) => {
    test(`Login as ${name}`, async ({ page }) => {
      // Go to login page
      await page.goto(baseUrl);
      console.log("Base Url:", baseUrl);

      // Fill login form
      await page
        .getByRole("textbox", { name: "Mobile Number" })
        .fill(mobileNumber);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Log In" }).click();

      // Wait for dashboard
      await page.waitForURL(`${baseUrl}/agent/dashboard`, { timeout: 5000 });
      await expect(page).toHaveURL(`${baseUrl}/agent/dashboard`);

      // ✅ Logout step
      await page
        .locator('//i[@class="mdi mdi-chevron-down d-xl-inline-block"]')
        .click();
      await page.locator('//span[text()="Logout"]').click();

      // Expect to be redirected back to login page
      await expect(page).toHaveURL(`${baseUrl}/login`);
    });
  });
});
