import { test, expect } from '@playwright/test';
test('take a simple screenshot for debugging', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    // Take a screenshot and save it as 'playwright_homepage.png'
    await page.screenshot({
        path: 'test-results/playwright_homepage.png',
        // quality: 50 // 1-100 default is 100
    });
});

test('take a simple screenshot of header fullpages', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    // Take a screenshot of the entire page not only vw
    await page.screenshot({
        path: 'test-results/playwright_homepage.png',
        fullPage: true
    });
});

test('take a simple screenshot of header', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    // Take a screenshot of just the header element
    const element = page.locator('header');
    await element.screenshot({
        path: 'test-results/element-screenshot.png'
    });
});

test('take a simple screenshot of header with more options', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    // Take a screenshot of just the header element
    const element = page.locator('header');
    await element.screenshot({
        path: 'test-results/element-screenshot-options.png',
        omitBackground: true, // Transparent background
        scale: 'css', // Smaller file size
        animations: 'disabled', // Freeze all animations
        timeout: 5000 // Wait a maximum of 5 seconds
    });
});
