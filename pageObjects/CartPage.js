class CartPage{
    constructor(page, expect){
        this.page = page;
        this.expect = expect;
        this.cartButton = page.locator("button[class='btn btn-custom']").nth(2);
        this.productValue = page.locator("div.cartSection p").nth(1);
        this.totalValue = page.locator('[class="prodTotal cartSection"] p');
        this.checkoutButton = page.getByRole('button', {name: 'Checkout'});
        this.cvv = page.locator("[class='input txt']").first();

    }

    async checkoutProducts(productAdded) {
        

        await this.cartButton.click();
        await this.page.locator('h3:has-text("'+productAdded+'")').waitFor();
        this.expect(await this.page.locator('h3:has-text("'+productAdded+'")')).toBeVisible();
        const productValText = await this.productValue.textContent();
        const totalValText = await this.totalValue.textContent();
    
        console.log(productValText, " ", totalValText);
        this.expect(productValText.includes(totalValText)).toBeTruthy();
    
        
        await this.checkoutButton.click();
        await this.cvv.waitFor({state: 'visible'});
    }
}
module.exports = {CartPage};