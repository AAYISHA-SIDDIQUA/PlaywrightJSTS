import {test, expect, Browser, Page, chromium} from '@playwright/test';
const {POManager} = require("../pageObjects/POManager");
const {customtest} = require("./utils/ExtendedData");
let poManager;

customtest('Login to client app using extended test data', async({page, testDataOrder}) => {

    poManager = new POManager(page, expect);

    const loginPage = poManager.getLoginPage();
    await loginPage.navigateTo();
    await loginPage.enterCredentials(testDataOrder.username, testDataOrder.password);

});