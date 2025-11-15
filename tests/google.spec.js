import {test, expect} from '@playwright/test';

test('Testing google', async({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.google.com");
    console.log(await page.title());

    await expect(page).toHaveTitle("Google");

});


test('Automate QA', async({page}) => {
    await page.goto("https://ultimateqa.com/automation");
    await expect(page.locator("[class='et_pb_menu__logo']")).toBeVisible();
    const mainText = await page.locator("#Automation_Practice > span > strong > span > span");
    const mainTextValue = await mainText.textContent();
    console.log(mainTextValue);
    await expect(mainText).toHaveText("Automation Practice");

    //if you want to mimic List<WebElement> and looping over the list concept of selenium, below can be used.
    const links = page.locator(".et_pb_text_inner > ul > li > a");
    const linksAll = await links.all();
    linksAll.forEach(async (link) => {
        console.log(await link.textContent());
    });

    //If we want to print all the returned elements text in one single go without looping, we can use allTextContents()
    console.log(await links.allTextContents());

    //if we want to get the count of options or the list of matches returned by the locator, use count()
    console.log(await links.count());

    //if you want to get the second or third or the first element from the list of matches, then you can use below. 

    //textContent - fetches the text even from hidden element including script and style tags texts
    //innerText -- only fetches the visible element texts and excluding the script and style tags texts
    const firstLinkText = await page.locator(".et_pb_text_inner > ul > li > a").first().textContent();
    const secondLinkText = await page.locator(".et_pb_text_inner > ul > li > a").nth(1).innerText();
    const lastLinkText = await page.locator(".et_pb_text_inner > ul > li > a").last().innerText();

    console.log(firstLinkText, " " , secondLinkText, " ", lastLinkText);

});

test('Different Locators & waits', async({page}) => {
    await page.goto("https://ultimateqa.com/automation");

    //waitFor() method is used to wait for a single element match locator
    await page.getByText("Fake Pricing Page").waitFor();
    const fakePriceLink = page.getByText("Fake Pricing Page");
    await fakePriceLink.click();

    //waitForLoadState waits till all the network api calls are completed.
    await page.waitForLoadState('networkidle');
    const plan = await page.locator(".et_pb_pricing_title").all();
    for(const p of plan) {
        const content = await p.textContent();
        
        if (content.includes("Free")) {
            await expect(p).toHaveClass('et_pb_pricing_title');
            await expect(p).toHaveAttribute('class', 'et_pb_pricing_title');
        }
    }

});