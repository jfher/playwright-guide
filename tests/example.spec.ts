import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('homepage has Playwright in title', async ({ page }) => {
  // Navigate to the Playwright homepage
  await page.goto('https://playwright.dev');
  // Fetch the title of the page
  const title = await page.title();
  // Assert that the title contains 'Playwright'
  expect(title).toContain('Playwright');
});