import { test, expect } from '@playwright/test';

test.describe('Mashable Blog Tests', () => {
    test('Verify blog loads, search works, and tag filtering works', async ({ page }) => {
        // 1. Verify the blog at mashable.com loads
        console.log('Navigating to Mashable...');
        await page.goto('https://mashable.com', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveTitle(/Mashable/i);
        console.log('Mashable homepage loaded successfully.');

        // 2. Verify search input works
        console.log('Opening search bar...');
        const searchButton = page.getByRole('button', { name: 'Search' });
        await expect(searchButton).toBeVisible();
        await searchButton.click();

        console.log('Filling search input with "Playwright"...');
        const searchInput = page.getByPlaceholder('Search');
        await expect(searchInput).toBeVisible();
        await searchInput.fill('Playwright');
        await searchInput.press('Enter');

        console.log('Verifying search results page...');
        await expect(page).toHaveURL(/.*query=Playwright.*/);
        await expect(page).toHaveTitle(/Search for Playwright/i);
        console.log('Search results page loaded successfully.');

        // 3. Verify clicking a tag filters posts correctly
        console.log('Finding a category/tag link...');
        const tagLink = page.locator('a[href*="/category/"]').first();
        await expect(tagLink).toBeVisible();
        const tagText = await tagLink.innerText();
        console.log(`Clicking category tag: "${tagText}"`);

        await tagLink.click();

        console.log('Verifying tag filtering page...');
        await expect(page).toHaveURL(/.*\/category\/.*/);
        
        const newTitle = await page.title();
        console.log(`Successfully navigated to category page. New URL: ${page.url()}, New Title: ${newTitle}`);
    });
});
