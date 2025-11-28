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