import { test, expect } from '@playwright/test';

test('Auto-wait example - login flow', async ({ page }) => {
  await page.goto('https://app.realtor.works');

  
  await page.getByRole('textbox', { name: 'Mobile Number' }).fill('9000223107');

  
  await page.getByRole('textbox', { name: 'Password' }).fill('test');


  await page.getByRole('button', { name: 'Log In' }).click();


  await expect(page).toHaveURL('https://app.realtor.works/agent/dashboard');


  await expect(page.getByRole('heading', { name: 'YOUR DASHBOARD' })).toBeVisible();
});
