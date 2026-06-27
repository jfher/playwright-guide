import { expect } from 'playwright/test';
import { test } from './fixtures/auth';

test('should display shopping cart after login', async ({ loggedInPage }) => {
    const cartLink = loggedInPage.locator('.shopping_cart_link');
    await expect(cartLink).toBeVisible();
});