import {test, expect, Browser, Page, chromium} from '@playwright/test';
const {LoginPage} = require("../pageObjects/LoginPage");
const {ProductPage} = require("../pageObjects/ProductPage");
const {CartPage} = require("../pageObjects/CartPage");
const {SubmitOrderPage} = require("../pageObjects/SubmitOrderPage");


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
    const orders = page.getByRole('button', {name: 'ORDERS'});


    await orders.click();
    await page.waitForLoadState('networkidle');

    await page.locator("tbody th").first().waitFor({state: 'visible'});
    const orderIDRow = page.locator("tbody tr");
    const countofOrder = await orderIDRow.count();
    console.log(orderID, "and ", countofOrder);

    for(let i =0; i< countofOrder; i++) {
        const textOrder = await orderIDRow.nth(i).locator("th").textContent();
        console.log(textOrder.trim() , 'and ', orderID.trim());
        if(orderID.trim().includes(textOrder)) {
            console.log('inside it');
            await orderIDRow.nth(i).getByText('View').click();
            break;
        }
    }
    const orderText = await page.locator("[class='col-text -main']").textContent();

    expect(orderText).toContain(orderID.replace(/\|/g, '').trim());
    await page.getByText("order summary").waitFor({state: 'visible'});

});

test.afterAll('After all tests', async() => {
    console.log("Test Finished");
});

