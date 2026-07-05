# Common Commands

## Create

mkdir playwright-quick-setup
cd playwright-quick-setup
npm init -y

## Install

npm install playwright

## Types

npm install --save-dev @playwright/test

## Config scaffold

npm init playwright@latest

## Running

npx playwright test

## Specific test

npx playwright test tests/example.spec.ts

## Debug

npx playwright test --debug

## Check UI Mode

npx playwright test --ui

## Headed mode to show Browser

npx playwright test --headed

## Run specific project

npx playwright test --project=chromium
npx playwright test --project=firefox

## show report

npx playwright show-report

## Run multiple projects at once

npx playwright test --project chromium --project firefox

## Run specific tests by name filter

npx playwright test --project chromium --grep "user login"

## Run trace to check execution

npx playwright test fileName --trace on

### to define manually the test that we want to trace

 in spec.ts file we need to had
 await context.tracing.start({screenshots: true, snapshots: true}) //at the start
 await context.tracing.stop({path: 'trace.zip'}) //at the end

### to check downloaded files go to

trace.playwright.dev

## Use codegen

npx playwright codegen --help //To access the list of functions
npx playwright codegen -o //To create a file based on actions
npx playwright codegen --target=typescript //To determine the language of the code generated

## CHAPTER 6

## Enable parallelism

    npx playwright test --workers=4 or also use percentage as -workers=50%

- To disable parallelism we use
    npx playwright test --workers=1

- You can also can change it on config.ts via setting the workers option

- Inside a file we can define parallelism using intra-file config agrupation via

test.describe.parallel('description')  //For parallel execution

- also we can define the configuration for the whole file instead of groups via describe, this can be made using
    test.describe.configure({mode: 'parallel'}) at the start of the file

- We can make all test run in parallel mode using the config.ts file setting

    // playwright.config.ts
    export default defineConfig({
        fullyParallel: true,
    })

- Also we can define for each kind of browser or project defined adding the next line:
    projects: [
    {
        name: 'chromium',
        use: { browserName: 'chromium' },
            fullyParallel: true, // only this project runs all tests in parallel
        },  
    ]

## Sharding - Split test execution across multiple workers

You can split the work between all your CI runners running the command of playwrightt adding the --shard=x/y opttion:

npx playwright test --shard=1/2
npx playwright test --shard=2/2

- Also can define this sharding in the config.ts file with
    export default defineConfig({
        shard: {
            total: 3, // Total number of shards (splits)
            current: 1, // This shard instance
        },
    })

-Suppose you have 300 tests, and you want to run them split across 3 machines:
    - Machine 1 config:
        shard: { total: 3, current: 1 }
    - Machine 2 config:
        shard: { total: 3, current: 2 }
    - Machine 3 config:
        shard: { total: 3, current: 3 }

### Fine Tunning parallelism

In case we want to optimize the best configuration balance between CPU and RAM we can get the number of cores via os library

// playwright.config.js
    const { defineConfig } = require('@playwright/test');
    const os = require('os');
    const cpuCount = os.cpus().length;
    module.exports = defineConfig({
        workers: Math.max(1, cpuCount - 1), // leave 1 core free for OS
});

### Limitting heavy artifacts

        test.use({
            trace: 'on-first-retry',
            screenshot: 'only-on-failure',
            video: 'retain-on-failure',
        });

## CHAPTER 7

### Docker commands

Build image

docker build -t playwright-tests .

Run tests

docker run --rm -it --ipc=host playwright-tests

By default, Playwright generates an HTML report in the playwright-report directory.
To access this report (or any other artifacts such as screenshots or videos) generated inside the container, you need to mount a volume.
Modify your docker run command to include the -v flag:

docker run --rm -v "$(pwd)/playwright-report:/app/playwright-report"
playwright-tests

## CHAPTER 8

### Run test with node

Especially used to fetch data via webscraping or filling forms without a complete framework

import { chromium, Browser, BrowserContext, Page } from 'playwright';
(async () => {
    const browserHeadful: Browser = await chromium.launch({
    headless: false,
    devtools: true,
    slowMo: 50,
});

const context: BrowserContext = await browserHeadful.newContext();
const page: Page = await context.newPage();
await page.goto('https://playwright.dev/');
await page.screenshot({ path: 'example.png' });
await browserHeadful.close();
})();

### Run debug mode

npx playwright test --debug
npx playwright test example.spec.ts:10 --debug //:10 refers to run until the line 10

await page.pause();
We can use the line above whenever we want to force a debug mode inside our test

### Run UI mode

npx playwright test --ui

### Enable Screenshots

We can define to capture screenshots of the testt in the config.ts file
  - off: by default will never take a snap
  - on: will take every running test regardless of its a failure or success
  - only-on-failure: will take snaps only when testt fails
  - on-first-retry: only runs if the retry option is configured only will capture the first retry snap

export default defineConfig({
use: {
    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',
    // You can also configure other recording options here,
    // like video or trace, which are also very useful for debugging.
    // video: 'on-first-retry', // Example: record video on first retry
    // trace: 'on-first-retry', // Example: record trace on first retry
}})

### Manual screenshots

To take manual screens when needed the options that we can use are:

1. path (string): The file path to save the screenshot to.
2. fullPage (boolean): Whether to take a screenshot of the full scrollable page (default: false, takes a screenshot of the viewport).
3. clip (object): An object defining a rectangular area to clip the screenshot (like { x, y, width, height }).
4. omitBackground (boolean): Hides the default white background and allows capturing screenshots with transparency.
5. quality (number): The quality of the image, between 0-100. Not applicable to PNG images.
6. type ('jpeg' or 'png'): The image format.

await page.screenshot({ path: 'shot.png', fullPage: true });

### Video recording

To configure video recording we can use the config.ts file to add the following configuration.

export default defineConfig({
    use: {
        video: {
            mode: 'on',
            // Optional: specify video resolution
            size: { width: 1280, height: 720 },
        },
        // You also need to specify a directory for the videos
        contextOptions: {
            recordVideo: {
                dir: 'test-results/my-videos/', // Output directory
            },
        },
    },
});

- mode: The mode options for video may have the following parameters:
  - 'off' (default): No video recording.
  - 'on': Records a video for every single test run, regardless of success or failure. This can generate a lot of video files.
  - 'retain-on-failure': Records a video for each test, but only keeps the video files for tests that fail. Successful test videos are automatically deleted This is often a good balance.
  - on-first-retry': Records a video only when a test is retried for the first time. This is useful if you only want videos for flaky tests.
  
- size: You can specify the width and height for the recorded video. If not specified, Playwright defaults to the viewport size scaled down to fit 800x800. It’s often beneficial to set this to match your desired test viewport size for clear recordings.

- dir (in contextOptions.recordVideo: You can specify the directory where Playwright should save the recorded video files. Playwright will generate unique names for each video. Keep in mind that this isn’t required, but is useful if you want a way to view the videos outside of the HTML test report. Without this, the videos are still saved in the playwright-report folder based on the video mode option.

### Example running in node.js with video recording

import { chromium } from 'playwright';
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        recordVideo: {
            dir: 'test-results/my-videos/',
            size: { width: 1280, height: 720 },
        },
    });
    const page = await context.newPage();

    // Your automation steps here
    await page.goto('https://playwright.dev/');
    await page.getByText('Get started');

    // Important: Videos are saved upon browser context closure.
    // Make sure to close the context and browser.
    await context.close();
    await browser.close();
})();

## Chapter 9

### AXE-CORE

To check if our page or the testing page achievs the requirementes of a11y we can use axe-core library.

npm install @axe-core/playwright --save-dev

- Principles: At the highest level are four foundational principles, often remembered by the acronym POUR:
  
1. Perceivable: Information and user interface components must be presented to
users in ways they can perceive. This means providing alternatives for visual and
auditory content (such as alt text for images and captions for videos).
2. Operable: User interface components and navigation must be operable. This ensures that users can interact with the website, regardless of their input method (such as keyboard navigation and voice commands).
3. Understandable: Information and the operation of the user interface must be
understandable. This focuses on clear language, predictable functionality, and
consistent navigation.
4. Robust: Content must be sufficiently robust to be reliably interpreted by diverse user agents, including assistive technologies. This means using web standards correctly so content remains accessible as technology evolves.

- Conformance levels
WCAG success criteria are categorized into three conformance levels, which build upon each other:

1. Level A (Minimum): This is the most basic level of accessibility. It addresses major barriers that would make a website difficult or impossible for certain users with disabilities to access. Meeting Level A criteria is essential for a website to be considered accessible, but it doesn’t remove all barriers.
• Example: Providing text alternatives (alt text) for non-text content such as images (Success Criterion 1.1.1: Non-text Content).

2. Level AA (Recommended): This is the most commonly aimed-for level and is often required by accessibility laws and regulations (Section 508 in the US and EN 301 549 in Europe). Level AA includes all Level A criteria, plus additional criteria that enhance accessibility for a broader range of users and provide a better user experience.
• Examples: Ensuring a minimum contrast ratio for text and images of text (Success Criterion 1.4.3: Contrast (Minimum)); making content reflow without requiring two-dimensional scrolling (Success Criterion 1.4.10: Reflow).

3. Level AAA (Highest): This is the highest and most comprehensive level of conformance.
Achieving Level AAA means meeting all Level A and AA criteria, plus additional criteria that provide the maximum level of accessibility. While highly desirable, it’s not always practical or achievable for all types of web content, and WCAG itself doesn’t recommend it as a general rule.
• Examples: Providing sign language interpretation for prerecorded audio content
(Success Criterion 1.2.6: Sign Language (Prerecorded)); ensuring a higher contrast ratio for text (Success Criterion 1.4.6: Contrast (Enhanced)).

### Customize Axe Rules

withTags is the way to customizze the accessibility scans by filtering which rules will get applied.

Standard baseline
['wcag21aa']
The default. This targets WCAG 2.1 AA. It is the current
legal standard for most organizations and covers both A
and AA rules.

Enhanced quality
['wcag21aa', 'best-practice']
Recommended. Combines the legal baseline with industry-accepted best practices (such as strict heading hierarchies) that improve the actual user experience.

Futureproof
['wcag22aa'] Forward-looking. Targets the newer WCAG 2. AA standard. Use this if you want to prepare your application for upcoming regulatory shifts.

If you need to build a custom profile, here is what the individual tags represent:

• wcag2a: Refers to Level A conformance of the WCAG version 2.0 or 2.1. It represents the minimum level of accessibility, addressing essential requirements such as providing text alternatives for non-text content, but it doesn’t ensure full accessibility for all users.

• wcag2aa: Refers to WCAG 2.0 or 2.1 Level AA rules, which include Level A requirements plus additional criteria, such as sufficient color contrast. This is often the target for many organizations as it provides a robust level of accessibility without being as stringent as Level AAA.

• wcag21a: Specifically targets WCAG 2.1 Level A rules. WCAG 2.1 builds on WCAG 2.0, adding criteria to address mobile accessibility, low vision, and cognitive disabilities.

• wcag21aa: Targets WCAG 2.1 Level AA rules, combining WCAG 2.1 Level A with additional Level AA requirements.

• wcag22aa: Targets WCAG 2.2 Level AA rules. WCAG 2.2 is a more recent standard, and axe-core (in versions 4.5 and later) includes support for these rules, which is useful for future-proofing accessibility efforts.

• best-practice: Refers to rules that are not strictly tied to WCAG success criteria but represent industry-accepted practices that improve accessibility, such as ensuring that every page has an h1 heading. These are useful for enhancing user experience beyond minimum compliance.

### To test dynamic content

When testing dynamic content, make sure everything is fully loaded before scanning.
Playwright’s waitForLoadState('networkidle'); method can help with this by
ensuring that all content appears before your accessibility checks run.

### To define fixtures custom with accessibility

https://playwright.dev/docs/accessibilitytesting#creating-a-fixture.

## Chapter 10 Visual Regresion Testing

Visual regression testing involves capturing screenshots of web pages and comparing them against previously saved reference screenshots. When the current screenshot doesn't match the reference, it's flagged as a visual regression, indicating a potential change in the user interface.

 await element.screenshot({
        path: 'test-results/element-screenshot-options.png',
        omitBackground: true, // Transparent background
        scale: 'css', // Smaller file size
        animations: 'disabled', // Freeze all animations
        timeout: 5000 // Wait a maximum of 5 seconds
    });

### Visualize the golden screen, actual and diff images

npx playwright show-report

### Update generated snapshots for new when some ui changes happens

npx playwright test --update-snapshots

### Managing acceptable visual differences

We can configure in global for all the screenshots or for specific test.

- Global config:

import { defineConfig } from '@playwright/test';
export default defineConfig({
    expect: {
        toHaveScreenshot: {
            threshold: 0.2, // 20% pixel ratio difference allowed
            maxDiffPixels: 100 // max pixels allowed to differ
        },
    },
// other options ...
});

- Local test config:

    await expect(page).toHaveScreenshot('homepage.png', {
        maxDiffPixels: 10000, // allow up to 10000 differing pixels
        threshold: 0.2, // 20% pixel ratio difference allowed
    });

### Applying mask to ignore part of the page like ads, alerts, etc.

await expect(page).toHaveScreenshot('homepage.png', {
    // Pass an array of locators to mask
    mask: [page.locator('.dynamic-timestamp'),
    page.locator('.user-avatar')]
});

## Chapter 11 Mobile Device Simulator

To check all the listing prefab devices profiles
import { devices } from 'playwright';
console.log(Object.keys(devices));

To enable mobile simulator in playwright test config.ts:
projects: [
    {
        name: 'Mobile Chrome',
        use: {
            ...devices['Pixel 5'],
        },
    },
    {
        name: 'Mobile Safari',
        use: {
            ...devices['iPhone 12'],
        },
    },
],

we can customize the browser
const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, //Mobile screen size
    deviceScaleFactor: 2, //Pixel density
    isMobile: true, //To enable features like touch, swipe etc
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E14 Safari/604.1', //User agent string for browser
});

### Using projects with tags

We can define tags inside the projects via the grep option.
// grep is the option to enable the project in the test run.
projects: [
    {
        name: 'chromium',
        use: {
            ...devices['Desktop Chrome'],
        },
        // IMPORTANT: Set standard projects to ignore visual tests
        grepInvert: /@visual/,
    },
    {
        name: 'visual-mobile',
        use: {
            viewport: { width: 390, height: 844 },
        },
        // Only run tests matching this tag
        grep: /@visual/,
    },
    {
        name: 'visual-tablet',
        use: {
            viewport: { width: 768, height: 1024 },
        },
        grep: /@visual/,
    },
    {
        name: 'visual-desktop',
        use: {
            viewport: { width: 1920, height: 1080 },
        },
        grep: /@visual/,
    },
]

// grepInvert is the option to disable the project in the test run.
grepInvert: '@mobile',

// The @visual tag connects this block to the projects in the config. So all the test inside the describe will run with the projects that have the @visual tag.
test.describe('Visual regression @visual', () => {  
    test('homepage should look correct', async ({ page }) => {
        await page.goto('https://www.whatsmybrowser.org/');
        await expect(page).toHaveScreenshot({ fullPage: true });
    });
});

### Emulation of network IRL conditions

When we test real life applications normally we face trouble with network stability, signal, frequency etc. So we can simulate that with playwright:
To modify the network we use CDP only available in chromium browser:

const slow3G = {
    downloadThroughput: 500 * 1024 / 8, // 500 kbps
    uploadThroughput: 500 * 1024 / 8, // 500 kbps
    latency: 400, // 400ms
    offline: false,
};

// To skip if the browser is not chromium based
test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'This feature is currently only supported on Chromium.'
);

// To configure the client to use CDP
const client = await page.context().newCDPSession(page);

// To enable the network conditions
await client.send('Network.emulateNetworkConditions', slow3G);
console.log('Slow 3G network conditions have been enabled.');

// To disable the network conditions
await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1, // -1 disables throttling
    uploadThroughput: -1, // -1 disables throttling
});

### Geolocation

test.use({
    ...devices['Pixel 5'], // Emulate a Pixel 5 device
    geolocation: {
        latitude: 41.889938, // Mock latitude (Rome, Italy)
        longitude: 12.492507 // Mock longitude (Rome, Italy)
    },
    permissions: ['geolocation'],
});

### Device orientation

const context = await browser.newContext({
...devices['iPhone 12'],
    screen: {
        width: 844, // Landscape width
        height: 390 // Landscape height
    }
});

### Mobile gestures

const iPhone15 = devices['iPhone 15'];
test.use({
    viewport: iPhone15.viewport,
    ...iPhone15,
    userAgent: iPhone15.userAgent,
});

test('Wikipedia search field interaction on mobile', async ({ page }) => {
    // Navigate to Wikipedia
    await page.goto('https://www.wikipedia.org/');
    // Tap the search input field
    await page.tap('input[name="search"]');
    // Type something
    await page.fill('input[name="search"]', 'Playwright');
    // Tap the search button
    await page.tap('button[type="submit"]');
    // Assert that a new page loads
    await expect(page).toHaveURL(/.*Playwright.*/);
});

### Common issues

- Permissions
    const context = await browser.newContext({
        ...devices['iPhone 13'],
        permissions: { 'geolocation': 'grant', 'notifications': 'deny' },
    });

- Popups
    await page.locator('#cookie-consent-accept').waitFor({ state: 'visible'});
    await page.touchscreen.tap('#cookie-consent-accept');

    If the popup dont have a close button when can tap "outside to dissmiss the modal"
    await page.touchscreen.tap(10, 10); // Taps near the top-left corner

## Chapter 12 Forms

The most common way to interact in a web app is via a form to input data, to register, to login or to search.
All happens in a form in a way or another so this are some ways we can interact with forms in playwright:

- Fill
    await page.getByLabel('Username').fill('my_user');

- Type
    await page.getByLabel('Username').type('my_user');

- PressSequentially
    await page.getByLabel('Username').pressSequentially('my_user');

### Dropdowns

const countryDropdown = page.getByLabel('Country');

// Select by value ('DE' for Germany)
    await countryDropdown.selectOption('DE');

// Select by label (visible text)
    await countryDropdown.selectOption({ label: 'United Kingdom' });

// Select by index
    await countryDropdown.selectOption({ index: 2 });

fill set the value in the input field, clears the field, triggers input events butt no key events, dont simulate typing to quickly setup values fast
type simulates typing in the input field, triggers key down, press and up, dont clear the field
press simulates pressing a key, dont clear fields, no input events, triggers key events, no typing sim, used for submitting forms or navigate with keyboard
pressSequentially simulates typing in the input field, dont clears input, triggger input event, triggers key down, press and up, simulating real human typing slower

### Multiple selections on dropdowns

const toppingsDropdown = page.getByLabel('Toppings');

// Select multiple toppings by their values
    await toppingsDropdown.selectOption([
        'pepperoni',
        'mushrooms',
        'onions'
    ]);

// Or by labels
    await toppingsDropdown.selectOption([
        { label: 'Pepperoni' },
        { label: 'Mushrooms' },
        { label: 'Onions' }
    ]);

### File uploads

    await page.getByLabel('Upload a file').setInputFiles(['file1.txt', 'file2.png']);
    // Or remove files
    await page.getByLabel('Upload a file').setInputFiles([]);

### Checkboxes and radios

Checks are smartt the test will wait to the check to be ready to excute one of the following actions:

// Check a checkbox
await page.get_by_label("I agree to the terms").check();

// Uncheck a checkbox
await page.uncheck('#accept-terms');

// Check all radio buttons with the same name
await page.getByRole('radio', { name: 'Option 1' }).check();

//radios can also be selected with check() Remember that radios will only have one checked per group
await page.check('input[value="red"]')

### Assertions on checks and radios

const termsCheckbox = page.locator('#accept-terms');
await termsCheckbox.check();
await expect(termsCheckbox).toBeChecked();

//Negation
await expect(page.locator('#accept-terms')).not.toBeChecked();

### Date pickers

For native HTML pickers we can use the common fill method:
await page.fill('input[type="date"]', '2025-08-08');

For custom calendar pickers we can use sometthing like that:
// Define locators
const datePickerInput = page.locator('#date-picker-input');
const calendar = page.locator('.calendar');
const yearDropdown = page.locator('.year-dropdown');
const monthSelectorAugust = page.locator('.month-selector[datamonth="August"]');
const daySelector8 = page.locator('.day-selector[data-day="8"]');

// Open the date picker
    await datePickerInput.click();
// Wait for the calendar to appear
    await calendar.waitFor({ state: 'visible' });
// Select year (dropdown)
    await yearDropdown.selectOption('2025');
// Select month (clicking a month button)
    await monthSelectorAugust.click();
// Select day
await daySelector8.click();

Considering that using aria selectors will be more accurate (if available) and prevent random ids or name changes

### Custom fields

In frameworks like VUE, ANGULAR or REACT normally the pickers or fields came with custom animations in those cases is more easy and painless to use pure JS to access the values like this code:

await page.evaluate((date) => {
    document.querySelector('#date-picker-input').value = date;
    // trigger change event
    const event = new Event('change', { bubbles: true });
    document.querySelector('#date-picker-input').dispatchEvent(event);
}, '2025-08-08');

// Bubbles uses to let the event travels up in the DOM Tree just like a real person interact with the values. Remember that REACT by example depends on changing states so only filling values dont simulate the action like the human interaction

await page.evaluate((date) => {
    const input = document.querySelector('#date-picker-input');
    input.value = date;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}, '2025-08-08');

// Using this approach sometime could lead to bypass controls or validation like picking certain years, so to double check the field behavior its a good idea to pair with exceptions that help us to chek the value llike the following example:

await page.evaluate((date) => {
    const input = document.querySelector('#date-picker-input');
    input.value = date;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}, '2025-08-08');
await expect(page.locator('#date-picker-input')).toHaveValue('2025-08-08');

//If the custom field is inside a Shadow DOM (common in web coomponents) is prefered to use css locators to pierce shadow roots.

## Chapter 13 File up/download

To use all node librarys like path we need to create or have a tsconfig.ts file in the root of the project

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "types": ["node", "@playwright/test"],
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}

To set files we need to select via locators the input and call the seInputFiles method like this:

const filePath = path.join(__dirname, 'document.pdf');
await page.locator('input[type="file"]').setInputFiles(filePath);

To reset the input we pass an empty value or array to "reset" the files uploaded
await page.locator('#upload').setInputFiles([]);

### Use fake files

Sometimes we dont want to manage heavy files so we can mock some based on text
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

## Chapter 14 Security Auth

Normally when we login in a webapp, once the login is successfull the session stores into cookies or localstorage
With playwright we can check if the session is stored in cookies using the lines:

await expect.poll(async () =>
    (await page.context().cookies()).some(
    cookie => cookie.name === 'session-username'
)).toBeTruthy();

### Automate loggin and saving cookies in a setup file

import { test as setup, expect } from '@playwright/test';

setup('authenticate as standard_user', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/');

    // Log in with valid credentials
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify successful login
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();

    // Save the storage state to a file
    await page.context().storageState({ path: '.auth/standard_user.json' });
});

### Setup to run automatically in config.ts file

import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
    {
        name: 'setup',
        testMatch: /.*\.setup\.ts/,
    },
    {
        name: 'e2e-tests',
        dependencies: ['setup'],
        use: {
            storageState: '.auth/standard_user.json',
        },
    },
    ],
});

To avoid leaking sensible info we need to add to gitignore
.auth/

example of use o the file .json

// Use the saved storage state to bypass login

test.use({ storageState: './.auth/standard_user.json' });

test('should access inventory page with saved storage state', async ({ page }) => {
    // Navigate directly to the inventory page
    await page.goto('https://www.saucedemo.com/inventory.html');

    // Verify the inventory page is accessible without redirection
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();

    // Example: Perform an action on the inventory page
    await expect(page.locator('.inventory_item').first()).toBeVisible();
    await page.getByText('Add to cart').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

Or in config.ts

const config = {
    projects: [
        {
            name: 'authenticated',
            use: {
                storageState: './.auth/standard_user.json',
            },
        }
    ]
};

### Secure auth info in .env file

USERNAME=standard_user
PASSWORD=secret_sauce

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('login to example.com', async ({ page }) => {

    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    // Go to login page
    await page.goto('https://www.saucedemo.com/');
    
    // Log in with valid credentials
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

## Chapter 15 Best Practices

test.describe => Its a good way to group related tests in an structure for best organized test suites

### Fixtures to setup and teardown

We can define fixtures to setup test in a more organized way (similar to @before and @after in TestNG or to custom hooks in react)
Theres a little example:

export const test = base.extend({
    login: async ({ page }, use) => {
        await page.goto('https://www.saucedemo.com/');
        const login = async (username, password) => {
            await page.getByPlaceholder('Username').fill(username);
            await page.getByPlaceholder('Password').fill(password);
            await page.getByRole('button', { name: 'Login' }).click();
        };
    await use(login);
},
});

To use it we import the base test from our new test extension instead of the playwright official

import { test, expect } from './loginFixture';
import { expect } from '@playwright/test';

test.describe('Login Functionality', () => {
    test('should allow valid user to log in', async ({ login, page }) => {
        await login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('should show error for invalid credentials', async ({ login, page
    }) => {
        await login('locked_out_user', 'secret_sauce');
        await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
    });
});

Remember that each test case will run the login so its a better idea to use storageState to save the login session in a setup file (as seen above) to run just once.

### POM Pattern (Page Object Model)

POM is a design pattern widely used in the software industry and it helps us to design Page Objects. Each Page Object is a class that represents a page of the application and contains the locators and methods to interact with the page.

The structure of an POM is like follows:

import { type Page, type Locator } from '@playwright/test';

export class TodoPage {
    readonly page: Page;
    readonly newTodoInput: Locator;
    readonly todoItems: Locator;
    readonly clearCompletedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodoInput = page.locator('input.new-todo');
        this.todoItems = page.locator('ul.todo-list li');
        this.clearCompletedButton = page.locator('button.clear-completed');
    }

    async goto() {
        await this.page.goto('https://demo.playwright.dev/todomvc');
    }

    async addTodo(text: string) {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press('Enter');
    }

    async toggleTodo(index: number) {
        await this.todoItems.nth(index).locator('input.toggle').check();
    }

    async clearCompleted() {
        await this.clearCompletedButton.click();
    }
}

This how you use your custom POM

import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test('should add and complete a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addTodo('Buy groceries');
    await expect(todoPage.todoItems).toHaveCount(1);
    await todoPage.toggleTodo(0);
    await todoPage.clearCompleted();
    await expect(todoPage.todoItems).toHaveCount(0);
});

Theres a complete example of a login page using POM

import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private usernameInput: Locator;
    private passwordInput: Locator;
    private submitButton: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.submitButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    /**
    * Logs in with the given username and password.
    * @param {string} username - The username to use for login.
    * @param {string} password - The password to use for login.
    * Logs into the site using the provided credentials.
    */

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async getErrorMessage() {
        return this.errorMessage.textContent();
    }
}

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Functionality', () => {
    test('should allow valid user to log in', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('locked_out_user', 'secret_sauce');
        const error = await loginPage.getErrorMessage();
        expect(error).toBe('Epic sadface: Sorry, this user has been locked out.');
    });
});

An alternative to use dotenv is define a custom config.js file were we can define all the objects with data that will centralize our test's environment variables

{
    "baseUrl": "https://www.saucedemo.com/",
    "users": {
        "standard": {
            "username": "standard_user",
            "password": "secret_sauce"
        },
        "admin": {
            "username": "problem_user",
            "password": "secret_sauce"
        }
    }
}

And in our loin we can call it like this

import { test, expect } from '@playwright/test';
import config from '../config.json';

test('successful login with standard user', async ({ page }) => {
    await page.goto(config.baseUrl);
    await page.getByPlaceholder('Username').fill(config.users.standard.username);
    await page.getByPlaceholder('Password').fill(config.users.standard.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();
});

Example of fixture for a logging page

import { expect, test as baseTest, Page } from '@playwright/test';
import config from '../config.json';

// Define a new type for our custom fixtures.
// This allows for better autocompletion and type safety.
type MyFixtures = {
    loggedInPage: Page;
};

// Extend the base test with our custom fixture.
export const test = baseTest.extend<MyFixtures>({
    loggedInPage: async ({ page }, use) => {
        // This is the setup code for the fixture.
        await page.goto(config.baseUrl);
        await page.getByPlaceholder('Username').fill(config.users.standard.username);
        await page.getByPlaceholder('Password').fill(config.users.standard.password);
        await page.getByRole('button', { name: 'Login' }).click();

        // Use the fixture. This is where the test code runs.
        await use(page);
    
        // This is the teardown code for the fixture (if any).
        // In this case, there is no specific cleanup needed.
    },
});

import { test } from '../fixtures/test-setup';
import { expect } from '@playwright/test';

test('access cart after login', async ({ loggedInPage }) => {
    await loggedInPage.goto('https://www.saucedemo.com/cart.html');
    // Make sure Checkout button is visible
    await expect(loggedInPage.getByRole('button', { name: 'Checkout' })).toBeVisible();
});

### Generating dynamic data with libraries

To generate custom data each time we call a test we can use a dynamic generator like faker 
npm install @faker-js/faker --save-dev

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('register new user', async ({ page }) => {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await page.goto('/login');
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#success-message')).toHaveText(`Account created for ${username}`);
});

### Mocking response data with route

import { test, expect } from '@playwright/test';
test('displays mocked blog posts from JSONPlaceholder API', async ({ page }) => {

// Mock the specific API endpoint
    await page.route('https://jsonplaceholder.typicode.com/posts', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    userId: 1,
                    id: 1,
                    title: 'Mocked Post Title One',
                    body: 'This is the body of the first mocked post. It helps test rendering without real data.'
                },
                {
                    userId: 1,
                    id: 2,
                    title: 'Mocked Post Title Two',
                    body: 'Here\'s the second post body, keeping things consistent for reliable testing.'
                }
            ])
        });
    });

    const data = await page.evaluate(() =>
        fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json())
    );
    
    await expect(data[0].title).toBe('Mocked Post Title One');
    await expect(data[1].title).toBe('Mocked Post Title Two');
});
