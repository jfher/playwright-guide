import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30000, // Test timeout in milliseconds
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: 1000,
        }
      },

    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Ios',
      use: { ...devices['iPhone 12'] },
    },

    // User Agent
    {
      name: 'webkit-ipad',
      use: {
        ...devices['Desktop Safari'],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64rv:138.0) Gecko/20100101 Firefox/138.0',
      }
    },

    //Device Scale Factor
    {
      name: 'chromium-high-dpi',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 2,
      },
    },


    // Viewport
    {
      name: 'chromium-large',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox-mobile',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 375, height: 667 },
      },
    },



    //is Mobile
    {
      name: 'chromium-mobile-only',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },

    // JS enabled

    {
      name: 'chromium-no-js',
      use: {
        ...devices['Desktop Chrome'],
        javaScriptEnabled: false,
      },
    },

    // ignore HTTPS Errors

    {
      name: 'chromium-ignore-https',
      use: {
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
      },
    },

    //proxys
    {
      name: 'chromium-with-proxy',
      use: {
        ...devices['Desktop Chrome'],
        proxy: {
          server: 'http://username:password@yourproxy.com:8080',
        },
      },
    },


    //permissions

    {
      name: 'chromium-with-location',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['geolocation'], // Grants geolocation permission
      },
    },

    {
      name: 'chromium-no-camera',
      use: {
        ...devices['Desktop Chrome'],
        permissions: [], // Blocks all permissions
      },
    },

    //storageg state
    // Open a page and perform login.
    // Then save storage state to a file:
    // await context.storageState({ path: 'logged_in_state.json' });
    {
      name: 'chromium-logged-in',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'logged_in_state.json', // Path to a saved file
      },
    },


    //Specific channel
    {
      name: 'edge-stable',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // Stable channel
      },
    },
    {
      name: 'chrome-beta',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome-beta', // Beta channel
      },
    }






    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
