import {test, expect, Browser, Page, chromium} from '@playwright/test';
// const {LoginPage} = require("../pageObjects/LoginPage");
// const {ProductPage} = require("../pageObjects/ProductPage");
// const {CartPage} = require("../pageObjects/CartPage");
// const {SubmitOrderPage} = require("../pageObjects/SubmitOrderPage");
// const {OrdersPage} = require("../pageObjects/OrdersPage");

//I have commented the above imports and will be importing just POManager to get all the other objects of the Page object files.
const {POManager} = require("../pageObjects/POManager");

//Here, we are first converting JS object to proper JSON string - basically serialization. Then deserializing with parse to have 
//js object
const dataSet = JSON.parse(JSON.stringify(require("../testData/userData.json")));


//Commented below. You can uncomment and run if you are not going with test parameterization.
// test.describe.configure({mode: 'parallel'});

//test parameterization

for(const data of dataSet) {

    test.describe(`E commerce Product Ordering E2E Flow for ${data.username} - ${data.productName}`, () => {
        test.describe.configure({mode: 'serial'});
        let page;
        let browser;
        let context;
        let orderID;
        let poManager;
        
        test.beforeAll(`Login to client app for ${data.productName}`, async() => {
            browser = await chromium.launch();
            context = await browser.newContext();
            page = await context.newPage();

            poManager = new POManager(page, expect);

            const loginPage = poManager.getLoginPage();
            await loginPage.navigateTo();
            await loginPage.enterCredentials(data.username, data.password);

        });

        test(`checkout ${data.productName}`, async() => {

            const productPage = poManager.getProductPage();
            const cartPage = poManager.getCartPage();
            await productPage.addProducts(data.productName);

            await cartPage.checkoutProducts(data.productName);

        });

        test(`checkout page  ${data.productName}`, async() => {
            const submitOrderPage = poManager.getSubmitOrderPage();
            await submitOrderPage.submitOrder();
            orderID = await submitOrderPage.fetchOrderID();
            console.log(orderID);
        });

        test(`fetch order ID  ${data.productName}`, async() => {
            const ordersPage = poManager.getOrdersPage();
            await ordersPage.viewOrderDetails(orderID);
        });

        test.afterAll(`After all tests  ${data.productName}`, async() => {
            await browser.close();
            console.log("Test Finished");
        });
    })
}
