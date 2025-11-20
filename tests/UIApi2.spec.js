import {test, expect, Browser, Page, chromium} from '@playwright/test';
import { text } from 'stream/consumers';

//we can either use a single page executions by using the global variable as page, context. 
//If we want multiple pages in a single context to be automated, then we can store the login information in storageState
// and then assign that to new context invoking storageState so that login informatin is shared between all pages and in that context

let context;
let orderID;
let newContextInfo;

test.describe.configure({mode: 'serial'});

test.beforeAll('Login to client app', async({browser}) => {
    context = await browser.newContext();
    const page = await context.newPage();

    const username = page.getByPlaceholder("email@example.com");
    const passrd = page.getByPlaceholder("enter your passsword");
    const loginButton = page.locator("[value='Login']");


    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.waitForLoadState('networkidle');
    await username.fill("aisha1@gmail.com");
    await passrd.fill("Nayeema@1997");
    await loginButton.click();

    await page.waitForLoadState('networkidle');
    await page.waitForURL('https://rahulshettyacademy.com/client/#/dashboard/dash');

    //below context.storageState({path: 'state.json'}) is used to get all the token or cookies information upon login and save into
    //state.json file. This file will be created on its own and will be updated as and when during the execution. 
    await context.storageState({path: 'state.json'});
    newContextInfo = await browser.newContext({storageState: 'state.json'});
});

test('checkout', async() => {
    const page = await newContextInfo.newPage();

    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");
    await page.locator('.card-body b').first().waitFor({state: 'visible'});
    const products = page.locator('.card-body b');
    const count = await products.count();
    console.log(count);
    const addToCartButton = page.locator(".card-body button");
    const countOfAddToCart = await addToCartButton.count();


    //instead of below for loop, we can also use like blow 
    //await products.filter({hasText: 'ADIDAS ORIGINAL'})
    for(let i=0; i < count; i++) {
        if(await products.nth(i).textContent() === "ADIDAS ORIGINAL") {
            console.log(await products.nth(i).textContent());
            for(let n=i*2; n < countOfAddToCart; n++) {
                if(await addToCartButton.nth(n).textContent() === " Add To Cart") {
                    await addToCartButton.nth(n).click();
                    break;
                }
            }

        }
    }

    await page.locator("button[class='btn btn-custom']").nth(2).waitFor({state: 'visible'});
    await page.locator("button[class='btn btn-custom']").nth(2).waitFor();
    const cartButton = page.locator("button[class='btn btn-custom']").nth(2);

    await cartButton.click();
    await page.locator('h3:has-text("ADIDAS ORIGINAL")').waitFor();
    expect(await page.locator('h3:has-text("ADIDAS ORIGINAL")')).toBeVisible();
    const productValue = await page.locator("div.cartSection p").nth(1).textContent();
    const totalValue = await page.locator('[class="prodTotal cartSection"] p').textContent();

    console.log(productValue, " ", totalValue);
    expect(productValue.includes(totalValue)).toBeTruthy();

    const checkout = page.getByRole('button', {name: 'Checkout'});
    await checkout.click();

    await page.locator("[class='input txt']").first().waitFor({state: 'visible'});
   
    const cvv = page.locator("[class='input txt']").first();
    const name = page.locator("[class='input txt']").nth(1);
    const coupon = page.locator("[name='coupon']");

    const selecting = page.getByPlaceholder("Select Country");

    await cvv.fill("123");
    await name.fill("aayisha");

    await selecting.pressSequentially("ind", {delay:100});

    await page.locator("[class='ta-results list-group ng-star-inserted'] button span").first().waitFor({state: 'visible'});
    const option = page.locator("[class='ta-results list-group ng-star-inserted'] button span");
    const countOption = await option.count();
    const placeOrder = page.getByText('Place Order');

    for(let i =0; i < countOption; i++) {
        let valueOption = await option.nth(i).textContent();
        if(valueOption.trim() === "India") {
            await option.nth(i).click();
            break;
        }
    }

    await page.getByText('Place Order').click();
    await page.waitForLoadState('networkidle');
    orderID = await page.locator("tbody label").nth(1).textContent();
    console.log(orderID);
});

test('fetch order ID', async() => {
    const page = await newContextInfo.newPage();

    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");
    await page.waitForLoadState('domcontentloaded');
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

