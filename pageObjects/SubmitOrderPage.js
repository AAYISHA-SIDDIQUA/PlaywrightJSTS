class SubmitOrderPage{
    constructor(page){
        this.page = page; 
        this.cvv = page.locator("[class='input txt']").first();
        this.name = page.locator("[class='input txt']").nth(1);
        this.coupon = page.locator("[name='coupon']");
        this.selecting = page.getByPlaceholder("Select Country");
        this.selectOption = page.locator("[class='ta-results list-group ng-star-inserted'] button span").first();
        this.options = page.locator("[class='ta-results list-group ng-star-inserted'] button span");
        this.placeOrderButton = page.getByText('Place Order');
        this.orderIDText = page.locator("tbody label").nth(1);

    }

    async submitOrder() {

    
        await this.cvv.fill("123");
        await this.name.fill("aayisha");
    
        await this.selecting.pressSequentially("ind", {delay:100});
    
        await this.selectOption.waitFor({state: 'visible'});
        const countOption = await this.options.count();
    
        for(let i =0; i < countOption; i++) {
            let valueOption = await this.options.nth(i).textContent();
            if(valueOption.trim() === "India") {
                await this.options.nth(i).click();
                break;
            }
        }
    
        await this.placeOrderButton.click();
        await this.page.waitForLoadState('networkidle');

    }

    async fetchOrderID() {
        const orderID = await this.orderIDText.textContent();
        return orderID;
    }
}

module.exports ={SubmitOrderPage};