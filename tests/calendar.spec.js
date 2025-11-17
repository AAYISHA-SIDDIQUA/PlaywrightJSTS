import {test, expect} from '@playwright/test';

test('Calendar functions', async({page}) => {

    const month = '11';
    const date = '4';
    const year = '2025';
    const selectedDate = [month, date, year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator("div.react-date-picker__inputGroup").waitFor({state: 'visible'});
    await page.locator("div.react-date-picker__inputGroup").click();

    const datePick = page.locator("//abbr[text()='"+date+"']");
    await datePick.click();

    const pickers = page.locator(".react-date-picker__inputGroup__input");

    for(let i=0; i<pickers.count(); i++) {
        const val = await pickers.nth(i).inputValue();
        expect(val).toEqual(selectedDate[i]);
    }
    

});


test('More validations', async({page}) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://www.google.com");
    await page.goBack();
    await page.goForward();
    await page.goBack();

    await page.waitForLoadState('networkidle');
    const editBox = page.locator("#displayed-text");
    const hide = page.locator("#hide-textbox");

    await expect(editBox).toBeVisible();
    await hide.click();
    await expect(editBox).toBeHidden();

    page.on('dialog', dialog => {
        const val = dialog.message();
        console.log(val);
        console.log(dialog.type());
        if(dialog.type() === 'alert') {
            dialog.accept();
        } else if (dialog.type() === 'confirm') {
            dialog.dismiss();
        }
    })
    const alertButton = page.locator("#alertbtn");
    const confirmButton = page.locator("#confirmbtn");

    await alertButton.click();
    
    //can use page.once listener as this will only listen to the next one alert active and not all. 
    // page.once('dialog', dialog => {
    //     const val2 = dialog.message();
    //     console.log(val2);
    //     dialog.dismiss();
    // });

    await confirmButton.click();

    //Frames

    await page.getByText("iFrame Example").scrollIntoViewIfNeeded();
    const frame = page.frame("iframe-name");
    await frame.locator("//span[text()='Close']").click();
    const isVisible = await frame.getByText('Browse Learning Paths').isVisible();
    console.log("The button is => ", isVisible);

});