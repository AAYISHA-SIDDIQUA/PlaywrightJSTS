const {test, expect, request, chromium} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const payload = {userEmail:"aisha1@gmail.com",userPassword:"Nayeema@1997"};
const orderPayload = {orders:[{country:"India",productOrderedId:"68a961719320a140fe1ca57c"}]}
const fakeResponse = { data:[], message: "No Orders" };


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


test('Mocking response/network inception', async() => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState('networkidle');
    //When my order is clicked, we might see few orders we did. In order to validate the message when there are no order, we can 
    //intercept/mock the response of the request which is getting triggered at my orders click.

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakeResponse);
            route.fulfill(
                {
                    response, 
                    body,
                }
            );
        }
    );



    const orders = page.getByRole('button', {name: 'ORDERS'});

    await orders.click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    
    console.log(await page.locator(".mt-4").textContent());

});

test('Mock request/Network inception request', async({page}) => {
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState('domcontentloaded');

    const orders = page.getByRole('button', {name: 'ORDERS'});

    await orders.click();
    //we are mocking request of the view button in orders page. So we need to provide the mocking line before clicking on view button
   // below line states that to look for this url with any order id (*).
   //providing some other id instead of my own order id, so it should not allow me to see the order details
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async route => route.continue({url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=691deba05008f6a909457457"}));

    await page.getByRole('button', {name: 'View'}).first().click();
    await expect(page.locator('p').last()).toHaveText("You are not authorize to view this order");

});

test('Abort network calls & print logs', async({page}) => {
        //The below line used to abort the network calls
        await page.route('**/*{jpeg, png, jpg}', route=> route.abort());

        page.on('request', request=> console.log(request.url()));
        page.on('response', response => console.log(response.status(), response.url()));

        await page.goto("https://rahulshettyacademy.com/client/");

   
});

test.afterAll('After all tests', async() => {
    context.close();
    console.log("Test Finished");
});

