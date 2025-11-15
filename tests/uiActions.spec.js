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
    const radios = page.locator("input[name='radioButton']");
    const radioButton2 = radios.nth(1);
    const radioButton3 = radios.last();

    await expect(radioButtonText).toBeVisible();
    console.log(await radios.count());

    await radioButton2.click();
    await expect(radioButton2).toBeChecked();

    await radioButton3.click();
    await expect(radioButton2).not.toBeChecked();
    await expect(radioButton3).toBeChecked();
});

test('Checkbox validation', async() => {
    const checkBoxText = page.getByText('Checkbox Example');
    const thirdCheckBox = page.locator('#checkBoxOption3');
    const secondCheckBox = page.locator("[name='checkBoxOption2']");

    await expect(checkBoxText).toBeVisible();
    await expect(thirdCheckBox).not.toBeChecked();
    await thirdCheckBox.check();
    await expect(thirdCheckBox).toBeChecked();
    
    await thirdCheckBox.uncheck();
    await expect(thirdCheckBox).not.toBeChecked();

    await secondCheckBox.check();
    await thirdCheckBox.check();
    await expect(secondCheckBox, thirdCheckBox).toBeChecked();
});