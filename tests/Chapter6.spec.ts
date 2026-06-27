import { test, expect } from '@playwright/test'

test.describe('Chapter6: Tetst Parallelization and Performance Optimization', () => {

    test.describe.parallel('Parallel test suite intra-file', () => {
        test('Test 1 - Google.com has correct title', async ({ page }) => {
            await page.goto('https://google.com');
            await expect(page).toHaveTitle('Google');
        });

        test('Test 2 - Playwright.dev has correct title', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });

        test('Test 3 - GitHub has correct title', async ({ page }) => {
            await page.goto('https://github.com');
            await expect(page).toHaveTitle(/GitHub/);
        });
    })

    test.describe.configure({ mode: 'parallel' });
    test('Test 1 - Google.com has correct title', async ({ page }) => {
        await page.goto('https://google.com');
        await expect(page).toHaveTitle('Google');
    });

    test('Test 2 - Playwright.dev has correct title', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    })

    test('Test 3 - GitHub has correct title', async ({ page }) => {
        await page.goto('https://github.com');
        await expect(page).toHaveTitle(/GitHub/);
    });

    test.describe('Slowing timeout for outside requests', () => {
        // Fast test
        test('quick test', async ({ page }) => {
            await page.goto('https://google.com');
            await expect(page).toHaveTitle('Google');
        });
        // Slow test
        test('very slow test', async ({ page }) => {
            test.slow(); // Marking this test as slow
            // Simulate long-running test (1 minute)
            await page.waitForTimeout(60000);
        });
    })

    test.describe('Block network requests', () => {

        test('Block images', async ({ page }) => {
            await page.route('**/*.{png,jpg,jpeg,svg,gif}', (route) => route.abort());
        });

        test('Block ads and analytics', async ({ page }) => {
            await page.route('**/ads.googleads.com/**', (route) => route.abort());
            await page.route('**/analytics.googleads.net/**', (route) => route.abort());
        });

        test('Mock response', async ({ page }) => {
            await page.route('**/api/user/profile', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ name: 'Test User', id: 123 }),
                });
            });
        });

        test('Prevent the saving of snapshots,videos and traces when running are passing', async ({ page }) => {
            await page.screenshot({
                path: `screenshots/test-A-${Date.now()}.png`,
                fullPage: false
            });
        });
    })
});

// test.describe('Navigation and resource timing', () => {
//     test('Measure navigation timings', async ({ page }) => {
//         await page.goto('https://playwright.dev/');

//         // Wait until the page is fully loaded
//         await page.waitForLoadState('load');

//         // Extract navigation timing metrics
//         const timing = await page.evaluate(() => {
//             const navEntry = performance.getEntriesByType('navigation')[0];

//             return {
//                 startTime: navEntry.startTime,
//                 connectEnd: navEntry.connectEnd,
//                 domContentLoaded: navEntry.domContentLoadedEventEnd,
//                 loadTime: navEntry.loadEventEnd - navEntry.startTime,
//             };
//         });

//         // Log the timings (you can also add assertions here if you want)

//         console.log('Navigation timings:', timing);
//         // Example assertion: ensure loadTime is less than 5 seconds

//         expect(timing.loadTime).toBeLessThan(5000);
//     });
// })