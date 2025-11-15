import {test, expect, Page, Browser, chromium} from '@playwright/test';

let page;
let context;
let browser;

test.beforeAll('Launching the browser & assertions', async() => {
    browser = await chromium.launch();
    context = await browser.newContext();
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

    //To get boolean value of whether the radio button is checked or not
    const radioChecked = await radioButton3.isChecked();
    console.log("Is the radio button checked? ", radioChecked);
    
    //The below command to pause the execution and it will also open playwright inspector
    // await page.pause();
});

test('Checkbox validation', async() => {
    const checkBoxText = page.getByText('Checkbox Example');
    const thirdCheckBox = page.locator('#checkBoxOption3');
    const secondCheckBox = page.locator("[name='checkBoxOption2']");

    await expect(checkBoxText).toBeVisible();
    await expect(thirdCheckBox).not.toBeChecked();
    await thirdCheckBox.check();
    await expect(thirdCheckBox).toBeChecked();
    
    //We can use {not} to check for unchecked or not.
    await thirdCheckBox.uncheck();
    await expect(thirdCheckBox).not.toBeChecked();

    //We can also use toBeFalsy() method in expect
    expect(await thirdCheckBox.isChecked()).toBeFalsy();

    await secondCheckBox.check();
    await thirdCheckBox.check();
    await expect(secondCheckBox, thirdCheckBox).toBeChecked();
});


test('Dropdown actions', async() => {
    const dropText = page.getByText('Dropdown Example');
    const dropDown = page.locator("#dropdown-class-example");
    const dropString = '#dropdown-class-example';

    await expect(dropText).toBeVisible();

    //select by value
    await dropDown.click();
    await page.selectOption(dropString, 'option2');

    //select by visible text
    await dropDown.click();
    await page.selectOption(dropString, {label: 'Option3'});

    //select by index
    await dropDown.click();
    await page.selectOption(dropString, {index: 0});

    //To fetch the text contents of all the options of dropdown
    const dropTexts = await dropDown.allTextContents();
    console.log("Drop Down texts are: ", dropTexts);

    //To print the no of options present for that dropdown
    const dropDownOptionCount = await dropDown.locator('option').count();
    console.log("Dropdown options count are: ", dropDownOptionCount);

});

test('Switching Tab', async() => {
    const switchTabText = await page.getByText('Switch Tab Example');
    const newTabLinkButton = await page.getByRole('Link', {name: 'Open Tab'});

    await expect(switchTabText).toBeVisible();
    const [newPage] = await Promise.all([
       context.waitForEvent('page'),
       newTabLinkButton.click()
    ]);

    await expect(newPage).toHaveURL('https://www.qaclickacademy.com/');
    let emailText = await newPage.locator("#header-part li span").last().textContent();
    emailText = (emailText.split("@"))[1];

    console.log("Email id contains ", emailText);
    expect(await newPage.url().includes(emailText)).toBeTruthy();

    await expect(newTabLinkButton).toHaveAttribute('id', 'opentab');

});