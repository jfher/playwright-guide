import { test, expect, devices } from '@playwright/test';
test.describe('Responsive layout on mobile', () => {
    test('should display the mobile navigation menu on iPhone 15 Pro Max',
        async ({ browser }) => {
            const iPhone15PM = devices['iPhone 15 Pro Max'];
            // Create a new browser context with iPhone 15 Pro Max settings
            const context = await browser.newContext({
                ...iPhone15PM,
            });
            const page = await context.newPage();
            await page.goto('https://github.com');
            const mobileMenuButton = page.getByRole('button', { name: 'Toggle navigation' });
            await expect(mobileMenuButton).toBeVisible();
            // Clean up the context
            await context.close();
        });

    test('Custom mobile emulation test', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 667 },
            deviceScaleFactor: 2,
            isMobile: true,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/ 605.1.15(KHTML, like Gecko) Version / 13.1.1 Mobile / 15E148 Safari / 604.1',
        });

        const page = await context.newPage();
        // This test's purpose is only to generate a screenshot using
        // a custom mobile emulation setup.
        await page.goto('https://www.whatsmybrowser.org');
        await page.screenshot({ path: 'test-results/mobile/custom-mobile-emulation.png' });
        await context.close(); // closes all pages as well
    })


    const viewports = [
        { name: 'Mobile', width: 390, height: 844 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 },
    ];
    for (const viewport of viewports) {
        test(`should render correctly on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({
                width: viewport.width,
                height: viewport.height
            });
            await page.goto('https://www.whatsmybrowser.org/');
            await expect(page).toHaveScreenshot({ fullPage: true });
        });
    }
});