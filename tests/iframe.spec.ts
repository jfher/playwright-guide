import { test, expect } from '@playwright/test';

test('Interact with iframe old version with wayback machine', async ({ page }) => {
    await page.goto('https://web.archive.org/web/20250926180635/https://testpages.eviltester.com/styled/iframes-test.html');
    // Locate the iframe
    const frame = page.frameLocator('#thedynamichtml');
    // Interact with elements inside the iframe
    await expect(frame.getByRole('heading', { name: 'iFrame' }))
        .toBeVisible();
});

test('Interact with iframe actual version', async ({ page }) => {
    await page.goto('https://testpages.eviltester.com/pages/embedded-pages/iframes');
    // Locate the iframe
    const frame = page.frameLocator('#alist').first();
    // Interact with elements inside the iframe
    await expect(frame.getByRole('heading', { name: 'iFrame' }))
        .toBeVisible();
});

test('Interact with iframe', async ({ page }) => {
    await page.goto('https://testpages.eviltester.com/pages/embedded-pages/iframes');
    // Interact with elements inside the iframe
    await expect(page.locator('#alist').first()
        .contentFrame()
        .getByRole('heading', { name: 'iFrame' })
    ).toBeVisible();
});