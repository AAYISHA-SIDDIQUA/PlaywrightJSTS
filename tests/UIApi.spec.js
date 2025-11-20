const {test, expect, request, chromium} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const payload = {userEmail:"aisha1@gmail.com",userPassword:"Nayeema@1997"};
const orderPayload = {orders:[{country:"India",productOrderedId:"68a961719320a140fe1ca57c"}]}


let page;
let browser;
let context;
let req;
let response;


test.describe.configure({mode: 'serial'});

test.beforeAll('Login using API', async() => {
    browser = await chromium.launch();
    context =  await browser.newContext();
    page = await context.newPage();
    req = await request.newContext();

    const apiUtils = new APIUtils(req, payload);
    response = await apiUtils.orderCreation(orderPayload);
    console.log(response.token, "and", response.orderID);

});

test('Launch web page using token', async() => {
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState('networkidle');
    
});

test('fetch order ID', async() => {
    const orders = page.getByRole('button', {name: 'ORDERS'});


    await orders.click();
    await page.waitForLoadState('networkidle');

    await page.locator("tbody th").first().waitFor({state: 'visible'});
    const orderIDRow = page.locator("tbody tr");
    const countofOrder = await orderIDRow.count();
    console.log(response.orderID, "and ", countofOrder);

    for(let i =0; i< countofOrder; i++) {
        const textOrder = await orderIDRow.nth(i).locator("th").textContent();
        console.log(textOrder.trim() , 'and ', response.orderID.trim());
        if(response.orderID.trim().includes(textOrder)) {
            console.log('inside it');
            await orderIDRow.nth(i).getByText('View').click();
            break;
        }
    }
    const orderText = await page.locator("[class='col-text -main']").textContent();

    expect(orderText).toContain(response.orderID.replace(/\|/g, '').trim());
    await page.getByText("order summary").waitFor({state: 'visible'});

});

test.afterAll('After all tests', async() => {
    console.log("Test Finished");
});

