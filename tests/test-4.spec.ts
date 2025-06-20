import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://app.realtor.works/login");
  await page.getByPlaceholder("Enter Mobile Number").click();
  await page.getByPlaceholder("Enter Mobile Number").fill("9949177888");
  await page.getByPlaceholder("Enter Password").dblclick();
  await page.getByPlaceholder("Enter Password").fill("test");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("link", { name: " Leads" }).click();
  await page.getByRole("link", { name: " Projects" }).click();
  await page.getByRole("button", { name: " New" }).click();
  await page.locator("span").filter({ hasText: "Select Builder" }).click();
  await page.getByLabel("RAJAPUSHPA").click();
  await page.locator("span").filter({ hasText: "RAJAPUSHPA" }).click();
  await page.getByLabel("Vasavi Group").click();
  await page.getByRole("link", { name: " Contacts" }).click();
  await page
    .getByRole("row", { name: "J Alice Johnson 8090123456" })
    .getByRole("checkbox")
    .nth(1)
    .click();
  await page
    .getByRole("row", { name: "Amanda Clark 8858890123 Dec" })
    .getByRole("checkbox")
    .nth(1)
    .click();
  await page
    .getByRole("row", { name: "Amanda Turner 8232234567 Dec" })
    .getByRole("checkbox")
    .nth(1)
    .click();
  await page
    .getByRole("row", { name: "Amy Cooper 8606678901 Dec 23" })
    .getByRole("checkbox")
    .nth(1)
    .click();
  await page
    .getByRole("row", { name: "Benjamin Hill 8707789012 Dec" })
    .getByRole("checkbox")
    .nth(1)
    .click();
  await page
    .getByRole("row", { name: "S Bob Smith 8190234567 Dec 23" })
    .getByRole("checkbox")
    .nth(1)
    .click();
  await page.getByRole("button", { name: " Assign Project" }).click();
  await page.getByText("Prestige TranqillePrestige").click();
});
