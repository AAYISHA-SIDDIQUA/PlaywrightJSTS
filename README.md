This framework uses playwright in Javascript language

Steps:
1. Install Node.js and set the path of upto node.js in your system environment variable as NODE_HOME 
2. Install VSCode and add a new folder
3. Run in terminal -- npm init playwright@latest
4. For the questions to use JS/TS, select Javascript and provide tests folder for test files.
5. It will ask for installing github actions workflow, and browsers. Give true and install all browsers.

6. Write your tests in the .spec.js files under tests/ folder
7. Run your test with the below commands. 

npx playwright test --> run in headless
npx playwright test --headed --> run in headed mode
npx playwright test --headed --project chromium --project --firefox --> run in headed mode in both chromium and firefox browsers


When tests fails, the report is displayed automatically
But when tests passes, in order to see report run below command 
npx playwright show-report

If you want to run a single spec file, then use below command.
npx playwright test tests/google.spec.js --headed --project chromium

If you want to open playwright inspector to debug the code
npx playwright test tests/google.spec.js --headed --project chromium --debug

In order to use codegen capability of playwright, 
npx playwright codegen 'website url'


If you want trace logs, video and screenshots, you can add the config in playwright.config.js - use object
It by default will be stored under test-results folder - for each test folder. 
You can either go to https://trace.playwright.dev./ and select the trace.zip file and see the traces or use below command. 
npx playwright show-trace test-results/google-Automate-QA-chromium/trace.zip


If in case you are having both UI and API tests in a single spec file, in order to debug, use below. 
If we use npx playwright test --headed --debug -- this will open the inspector which will help us debug only the UI. 
So, instead, we can add the above command along with a specific spec file name in the package.json file under the Script section. 
  "scripts": {
    "test" : "npx playwright test tests/UIApi.spec.js --headed"
  },

Then add breakpoint in the file. 
Then open command paletter  - ctlr+ shift+p and click on Debug: Debug npm script to debug. 

Additionally, lets say your scripts fail with some application issue or some script level issue and you are in ui mode. 
Then in the Error section- Copy prompt button will be available which you can click to copy the detailed instructions of the error message and solution prompt to ask for any LLM. And you can paste that into any LLM like gemini, copilot, claude and get the solution for it.


You can also have multiple config files created but not recommended though and run the specific tests with specific config file. 
npx playwright test test file path --headed --config playwright.config1.js


Retry: 
We can rerun the failing test cases with the help of retry key in config file. 
  retries: process.env.CI ? 2 : 1,
First param is for the CI execution and second for the local. 
This will only work when we are working with test() of playwright and not with any custom fixture or custom extended data.
This is used to handle flaky tests and the tests which fails in the first attempt and then passess when retrying 1st time, will
be considered as a flaky tests. In report as well, it will be categorized as flaky tests. 

By default, playwright runs tests cases within a single file in serial way. 
If you want to enable parallel execution, we can just set the workers to more than 1 in playwrihgt.config.js
workers: 3
npx playwright test --headed --workers=4

if you want to run the tests cases within a single file in parallel, then you can set in the test file level the below one.
test.describe.configure({mode: 'parallel'});
test.describe.configure({mode: 'serial'});

If we run tests cases in serial in a single test file, and if first test case fails, then it will skip the remaining tests cases. There is a interdependency when we run tests in serial in a single test file. 

If you want to add tags to the test cases, you can give the tag in the test name. 
test('@Web First test case', async({page}) => {
  await page.goto("https://www.google.com/");
})

After adding tags like above to all the tests cases, you can run the test cases which has only the specific tags as below.
npx playwright test --headed --project chromium --grep '@Web'


ALLURE REPORTING: 
To download - npm install -D allure-playwright

Once downloaded, run the tests like below:
npx playwright test --headed --project chromium --grep '@Web' --reporter=line,allure-playwright

Once the tests are completed running, you will see a folder called allure-results in your framework. 
Now run - allure generate ./allure-results -> to make it in a readable report. 
Now to open the report -- allure open ./allure-report --> this will start the server where you will see the allure report


In order to make the tests run easy, i have grouped together all commands and provided in package.json scripts. 
  "scripts": {
    "test": "npx playwright test tests/UIApi.spec.js --headed",
    "alluretest": "npx playwright test --headed --project chromium --grep @Web --reporter=line,allure-playwright && allure generate ./allure-results --clean && allure open ./allure-report"
  },

  now you can just run with --> npm run alluretest
  It will run the tests, generate allure results and automatically open the allure report as well.
