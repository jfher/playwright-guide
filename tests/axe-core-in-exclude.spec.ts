import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('should analyze accessibility of the form and exclude the ad banner',
    async ({ page }) => {
        await page.goto('https://demoqa.com/automation-practice-form');
        const results = await new AxeBuilder({ page })
            .include('form') //! Only analyze elements within the 'form'
            .exclude('.Google-Ad') //! Skip elements with .Google-Ad class
            .analyze();
        // Log the violations for debugging/reporting
        if (results.violations.length > 0) {
            console.log('Accessibility Violations found:');
            results.violations.forEach(violation => {
                console.log(`- ${violation.id}: ${violation.description}`);
                console.log(` Help: ${violation.helpUrl}`);
                console.log(' Nodes:', violation.nodes.map(node => node.html).
                    join('\n'));
                console.log('---');
            });
        }
        // If violations are found, this test will fail and list them.
        expect(results.violations).toEqual([]);
    });

test.only('should not have accessibility violations on the page', async ({ page
}) => {
    await page.goto('https://www.google.com');
    const results = await new AxeBuilder({ page })
        // Only check for these two specific accessibility rules:
        .withRules(['color-contrast', 'image-alt'])
        .analyze();
    // You can also log the violations for more detailed
    // debugging if needed
    // Assert that there are no violations.
    expect(results.violations).toEqual([]);
});