import { test, expect } from '@playwright/test';
test('should search for "Playwright testing"', async ({ page }) => {
    // Navigate to Wikipedia
    await page.goto('https://en.wikipedia.org');

    // Locate the search box
    const searchBox = page.getByRole('combobox', {
        name: 'Search Wikipedia'
    });

    // Clear the input first if needed
    await searchBox.clear();

    // Type character by character
    await searchBox.pressSequentially('Playwright testing');

    // Submit the search by pressing Enter
    await searchBox.press('Enter');

    // Verify the page title contains the search term
    await expect(page).toHaveTitle(/.*Playwright testing.*/);
});

test('State dropdown functionality', async ({ page }) => {
    // Navigate to the form page
    await page.goto('https://demoqa.com/automation-practice-form');
    // Locate the state dropdown
    const stateDropdown = page.locator('#state');
    // Click state dropdown to open it
    await stateDropdown.click();
    // Select a state ("Haryana")
    const stateOption = page.getByText('Haryana');
    await expect(stateOption).toBeVisible();
    await stateOption.click();
});