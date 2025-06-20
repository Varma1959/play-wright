import { test, expect, Page } from "@playwright/test";



const login = async (page: Page) => {
  await page.goto("https://app.realtor.works");
  await page.getByRole("textbox", { name: "Mobile Number" }).fill("9000223107");
  await page.getByRole("textbox", { name: "Password" }).fill("test");
  await page.getByRole("button", { name: "Log In" }).click();
};

// ✅ Test Case 1: Login test

test("Login Test - should navigate to dashboard after login", async ({
  page,
}) => {
  await login(page);

  await page.waitForURL("https://app.realtor.works/agent/dashboard", {
    timeout: 5000,
  });

  await expect(page).toHaveURL("https://app.realtor.works/agent/dashboard");
});

// ✅ Test Case 2: Dashboard visibility test (after login)

test("Dashboard Test - should display YOUR DASHBOARD heading", async ({
  page,
}) => {
  await login(page);

  await page.waitForURL("https://app.realtor.works/agent/dashboard", {
    timeout: 5000,
  });

  await expect(
    page.getByRole("heading", { name: "YOUR DASHBOARD" })
  ).toBeVisible();
});

// ✅ Test Case 3: Builders visibility after clicking My Builders

test("My Builders Test - should display Builders heading", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "My Builders" }).click();

  await page.waitForURL("https://app.realtor.works/agent/builders", {
    timeout: 5000,
  });

  await expect(page.getByRole("heading", { name: "BUILDERS" })).toBeVisible();
});

// ✅ Test Case 4: Contacts visibility after clicking Contacts

test("Contacts Test - should display CONTACTS heading", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Contacts" }).click();

  await page.waitForURL("https://app.realtor.works/agent/contacts", {
    timeout: 5000,
  });

  await expect(page.getByRole("heading", { name: "CONTACTS" })).toBeVisible();
});

// ✅ Test Case 5: Projects visibility after clicking Projects

test("Projects Test - should display PROJECTS heading", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Projects" }).click();

  await page.waitForURL("https://app.realtor.works/agent/projects", {
    timeout: 5000,
  });

  await expect(page.getByRole("heading", { name: "PROJECTS" })).toBeVisible();
});

// ✅ Test Case 6: Leads visibility after clicking Leads

test("Leads Test - should display LEADS heading", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Leads" }).click();

  await page.waitForURL("https://app.realtor.works/agent/leads", {
    timeout: 5000,
  });

  await expect(page.getByRole("heading", { name: "LEADS" })).toBeVisible();
});

// ✅ Test Case 6: Documents Upload visibility after clicking Documents Upload

test("Documents Upload Test - should display KYC DOCUMENTS heading", async ({
  page,
}) => {
  await login(page);

  await page.getByRole("link", { name: "Documents Upload" }).click();

  await page.waitForURL("https://app.realtor.works/agent/documentsUpload", {
    timeout: 5000,
  });

  await expect(
    page.getByRole("heading", { name: "KYC DOCUMENTS" })
  ).toBeVisible();
});


