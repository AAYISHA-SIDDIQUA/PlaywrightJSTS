import {test, expect, Browser, Page, chromium} from '@playwright/test';
const {LoginPage} = require("../pageObjects/LoginPage");
const {ProductPage} = require("../pageObjects/ProductPage");
const {CartPage} = require("../pageObjects/CartPage");
const {SubmitOrderPage} = require("../pageObjects/SubmitOrderPage");
const {OrdersPage} = require("../pageObjects/OrdersPage");



let page;
let browser;
let context;
let orderID;

test.describe.configure({mode: 'serial'});

test.beforeAll('Login to client app', async() => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    const username = "aisha1@gmail.com";
    const password = "Nayeema@1997";

    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.enterCredentials(username, password);

});

test('checkout', async() => {

    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page, expect);
    await productPage.addProducts();

    await cartPage.checkoutProducts();

});

test('checkout page', async() => {
    const submitOrderPage = new SubmitOrderPage(page);
    await submitOrderPage.submitOrder();
    orderID = await submitOrderPage.fetchOrderID();
    console.log(orderID);
});

test('fetch order ID', async() => {
    const ordersPage = new OrdersPage(page, expect);
    await ordersPage.viewOrderDetails(orderID);
});

test.afterAll('After all tests', async() => {
    console.log("Test Finished");
});

