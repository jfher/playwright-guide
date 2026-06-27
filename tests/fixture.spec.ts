import { test, expect } from '@playwright/test';

test('check API response', async ({ request }) => {
    const response = await request.get('https://api.github.com');
    expect(response.status()).toBe(200);
});

test('manage browser-level settings', async ({ browser }) => {
    // Create a new context with custom settings
    const context = await browser.newContext({
        userAgent: 'My Custom User Agent',
        locale: 'fr-FR',
        // other options like timezoneId, colorScheme, etc.
    });
    // Create a page inside this context
    const page = await context.newPage();
    await page.goto('url');
    // Your test actions and assertions here
    await context.close();
});

test('check browser', async ({ browserName }) => {
    if (browserName === "chromium") {
        console.log(`Running on ${browserName}`);
    }
});


test('visit page', async ({ page }) => {
    await page.goto('https://www.google.com/');
    await expect(page).toHaveTitle(/Google/);
});