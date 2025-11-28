import {test, expect, Browser, Page, chromium} from '@playwright/test';
// const {LoginPage} = require("../pageObjects/LoginPage");
// const {ProductPage} = require("../pageObjects/ProductPage");
// const {CartPage} = require("../pageObjects/CartPage");
// const {SubmitOrderPage} = require("../pageObjects/SubmitOrderPage");
// const {OrdersPage} = require("../pageObjects/OrdersPage");

//I have commented the above imports and will be importing just POManager to get all the other objects of the Page object files.
const {POManager} = require("../pageObjects/POManager");



let page;
let browser;
let context;
let orderID;
let poManager;


test.describe.configure({mode: 'serial'});

test.beforeAll('Login to client app', async() => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    const username = "aisha1@gmail.com";
    const password = "Nayeema@1997";
    poManager = new POManager(page, expect);

    const loginPage = poManager.getLoginPage();
    await loginPage.navigateTo();
    await loginPage.enterCredentials(username, password);

});

test('checkout', async() => {

    const productPage = poManager.getProductPage();
    const cartPage = poManager.getCartPage();
    await productPage.addProducts();

    await cartPage.checkoutProducts();

});

test('checkout page', async() => {
    const submitOrderPage = poManager.getSubmitOrderPage();
    await submitOrderPage.submitOrder();
    orderID = await submitOrderPage.fetchOrderID();
    console.log(orderID);
});

test('fetch order ID', async() => {
    const ordersPage = poManager.getOrdersPage();
    await ordersPage.viewOrderDetails(orderID);
});

test.afterAll('After all tests', async() => {
    console.log("Test Finished");
});

