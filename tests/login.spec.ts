import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory.html/);
});

test('Check inventory page title', async ({ page }) => {
    await expect(page).toHaveTitle('Swag Labs');
});

test('Check shopping cart link is visible', async ({ page }) => {
    const cartLink = page.locator('.shopping_cart_link');
    await expect(cartLink).toBeVisible();
});


test('should share cookies between pages in the same context', async ({ context }) => {
    // Create two pages within the same context
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Set a cookie on page1
    await page1.goto('https://playwright.dev/');
    await page1.context().addCookies([{
        name: 'test_cookie',
        value: 'test_value',
        domain: '.example.com',
        path: '/',
    }]);

    // Navigate to the same domain on page2
    await page2.goto('https://playwright.dev/');

    // Verify that page2 has access to the same cookie
    const cookies = await page2.context().cookies();
    const testCookie = cookies.find(cookie => cookie.name === 'test_cookie');
    expect(testCookie).toBeDefined();
    expect(testCookie?.value).toBe('test_value');


    // Clean up
    await page1.close();
    await page2.close();
});


test('API request', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/todos/1');
    expect(response.ok()).toBeTruthy();
});


