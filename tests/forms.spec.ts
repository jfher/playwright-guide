import { test, expect } from '@playwright/test';
test('Login with invalid credentials shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    // Auto-waiting locators
    const usernameField = page.getByPlaceholder('Username');
    const passwordField = page.getByPlaceholder('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });
    const errorContainer = page.locator('[data-test="error"]');
    // Fill + submit
    await usernameField.fill('invalid_user');
    await passwordField.fill('wrong_password');
    await loginButton.click();
    // Assert error is visible and has exact text
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
    );
});

test('valid form submission redirects to confirmation', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const usernameField = page.getByPlaceholder('Username');
    const passwordField = page.getByPlaceholder('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });
    await usernameField.fill('standard_user');
    await passwordField.fill('secret_sauce');
    await loginButton.click();
    // Verify redirection to confirmation page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});