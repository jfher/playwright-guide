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
