import {test, expect, Page, Browser, chromium} from '@playwright/test';

let page;
let browser;

test.beforeAll('Launching the browser & assertions', async() => {
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    const blinkingText = await page.locator("[class='blinkingText']");

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page).toHaveTitle("Practice Page");
    await expect(page).toHaveURL("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(blinkingText).toBeVisible();

});

test('Radio Button', async() => {
    const radioButtonText = page.locator("#radio-btn-example legend");
    const radioButton2 = page.locator('input[value=radio2]');

    await expect(radioButtonText).toBeVisible();
    await radioButton2.click();
    await expect(radioButton2).toBeChecked();

});