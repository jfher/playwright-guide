import { test, expect } from '@playwright/test';

// test('Homepage should look the same', async ({ page }) => {
//     await page.goto('https://practicesoftwaretesting.com/contact');
//     await page.waitForLoadState('load');
//     // This is the magic line!
//     await expect(page).toHaveScreenshot('homepage.png');
// });

test('Homepage should look the same', async ({ page }) => {
    await page.goto('https://with-bugs.practicesoftwaretesting.com/#/contact');
    await expect(page).toHaveScreenshot('homepage.png');
});


test('Homepage should look the same with custom Max difference on pixels', async ({ page }) => {
    await page.goto('https://with-bugs.practicesoftwaretesting.com/#/contact');
    await expect(page).toHaveScreenshot('homepage.png', {
        maxDiffPixels: 10000, // allow up to 10000 differing pixels
    });
});