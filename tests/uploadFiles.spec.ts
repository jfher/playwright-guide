import { test, expect } from '@playwright/test';
import path from 'path';


test('should upload a single file', async ({ page }) => {
    // Navigate to the page with the file input
    await page.goto('https://demoqa.com/automation-practice-form');
    // Build an absolute path to the file you want to upload
    const filePath = path.join(__dirname, '../mapa 1.png');
    // Locate the input element and set the file
    await page.locator('input[type="file"]').setInputFiles(filePath);
    // Confirm the file input reflects the selected file
    await expect(page.locator('#uploadPicture')).toHaveValue(/mapa 1\.png$/);
    // You can also click the submit button and
    // add assertions to verify the upload was successful
});


test('should upload multiple files successfully', async ({ page }) => {
    // Navigate to the file upload page.
    await page.goto('https://filebin.net/');
    // Locate the file input element
    const fileInput = page.locator('input[type="file"]');
    // Set multiple files for upload.
    // Ensure these files exist in your test directory.
    await fileInput.setInputFiles([
        path.join(__dirname, '../mapa 1.png'),
        path.join(__dirname, '../mapa 2.png'),
    ]);
    // Wait for the shareable link to appear,
    // indicating upload has finished
    await page.waitForEvent('load')
    await expect(page.getByRole('link', { name: 'Download files' })).toBeVisible();
    // Verify that the file names are displayed in the UI
    await expect(
        page.getByRole('link', { name: 'mapa 1.png' }).first()
    ).toBeVisible();
    await expect(
        page.getByRole('link', { name: 'mapa 2.png' }).first()
    ).toBeVisible();
});

test('should upload multiple fake files successfully', async ({ page }) => {
    // Navigate to the file upload page.
    await page.goto('https://filebin.net/');
    // Locate the file input element
    const fileInput = page.locator('input[type="file"]');
    // Set multiple files for upload.
    // Ensure these files exist in your test directory.
    await fileInput.setInputFiles([
        {
            name: 'file1.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from("Hey, this is the first file's content!")
        },
        {
            name: 'file2.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from("Yo, this is the second file's content!")
        }
    ])
    // Wait for the shareable link to appear,
    // indicating upload has finished
    await page.waitForEvent('load')
    await expect(page.getByRole('link', { name: 'Download files' })).toBeVisible();
    // Verify that the file names are displayed in the UI
    await expect(
        page.getByRole('link', { name: 'file1.txt' }).first()
    ).toBeVisible();
    await expect(
        page.getByRole('link', { name: 'file2.txt' }).first()
    ).toBeVisible();
});