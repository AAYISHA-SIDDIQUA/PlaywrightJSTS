class OrdersPage {
    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
        this.orders = page.getByRole('button', {name: 'ORDERS'});
        this.firstOrder = page.locator("tbody th").first();
        this.orderIDRow = page.locator("tbody tr");
        this.orderDetails = page.locator("[class='col-text -main']");
        this.orderSummary = page.getByText("order summary");


    }

    async viewOrderDetails(orderID) {


        await this.orders.click();
        await this.page.waitForLoadState('networkidle');
    
        await this.firstOrder.waitFor({state: 'visible'});
        const countofOrder = await this.orderIDRow.count();
        console.log(countofOrder);
    
        for(let i =0; i< countofOrder; i++) {
            const textOrder = await this.orderIDRow.nth(i).locator("th").textContent();
            console.log(textOrder.trim() , 'and ', orderID.trim());
            if(orderID.trim().includes(textOrder)) {
                console.log('inside it');
                await this.orderIDRow.nth(i).getByText('View').click();
                break;
            }
        }
        const orderText = await this.orderDetails.textContent();
    
        this.expect(orderText).toContain(orderID.replace(/\|/g, '').trim());
        await this.orderSummary.waitFor({state: 'visible'});
    
    }
}

module.exports = {OrdersPage};