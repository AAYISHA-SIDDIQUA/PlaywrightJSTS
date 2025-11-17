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