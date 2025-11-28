//This file is for the Page Object Manager. Instead of importing all PO class in test files, we can just import POManager file
//which will return the object instance of all the PO files. 

const { CartPage } = require("./CartPage");
const { LoginPage } = require("./LoginPage");
const { OrdersPage } = require("./OrdersPage");
const { ProductPage } = require("./ProductPage");
const { SubmitOrderPage } = require("./SubmitOrderPage");

class POManager{
    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
        this.loginPage = new LoginPage(this.page);
        this.ordersPage = new OrdersPage(this.page, this.expect);
        this.productPage = new ProductPage(this.page);
        this.cartPage = new CartPage(this.page, this.expect);
        this.submitOrderPage = new SubmitOrderPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getProductPage() {
        return this.productPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getOrdersPage() {
        return this.ordersPage;
    }

    getProductPage(){
        return this.productPage;
    }

    getSubmitOrderPage() {
        return this.submitOrderPage;
    }

}

module.exports = {POManager};