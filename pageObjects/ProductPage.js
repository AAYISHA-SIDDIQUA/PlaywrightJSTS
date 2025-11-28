class ProductPage{
    constructor(page) {
        this.page = page;
        this.cartBody = page.locator('.card-body b').first();
        this.products = page.locator('.card-body b');
        this.addToCartButton = page.locator(".card-body button");
        this.cartButton = page.locator("button[class='btn btn-custom']").nth(2);
    }


    async addProducts(productName) {
        await this.cartBody.waitFor({state: 'visible'});

        const count = await this.products.count();
        console.log(count);

        const countOfAddToCart = await this.addToCartButton.count();
    
    
        //instead of below for loop, we can also use like blow 
        //await products.filter({hasText: 'ADIDAS ORIGINAL'})
        for(let i=0; i < count; i++) {
            if(await this.products.nth(i).textContent() === productName) {
                console.log(await this.products.nth(i).textContent());
                for(let n=i*2; n < countOfAddToCart; n++) {
                    if(await this.addToCartButton.nth(n).textContent() === " Add To Cart") {
                        await this.addToCartButton.nth(n).click();
                        break;
                    }
                }
    
            }
        }
    
        await this.cartButton.waitFor({state: 'visible'});
        await this.cartButton.waitFor();
    
    }

} module.exports = {ProductPage};