import {test, expect, request, chromium} from '@playwright/test';
import { text } from 'stream/consumers';

const payload = {userEmail:"aisha1@gmail.com",userPassword:"Nayeema@1997"};
const orderPayload = {orders:[{country:"India",productOrderedId:"68a961719320a140fe1ca57c"}]}


let page;
let browser;
let context;
let req;
let token;
let orderID;

test.describe.configure({mode: 'serial'});

test.beforeAll('Login using API', async() => {
    browser = await chromium.launch();
    context =  await browser.newContext();
    page = await context.newPage();
    req = await request.newContext();
    const res = await req.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
    {
        data: payload
    });

    expect(res.ok()).toBeTruthy();
    const loginRes = await res.json();
    token = loginRes.token;
    console.log(token);

});

test('Launch web page using token', async() => {
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState('networkidle');
    
});

test('create order through api', async() => {
   
    const orderAPI = await req.post('https://rahulshettyacademy.com/api/ecom/order/create-order', 
    {
        data: orderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    });

    expect(orderAPI.ok()).toBeTruthy();
    const responseJson = await orderAPI.json();
    orderID = responseJson.orders[0];
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

