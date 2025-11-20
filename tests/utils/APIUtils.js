class APIUtils
{
    constructor(req, payload) 
    {   
        this.req = req,
        this.payload = payload
    }
    async doLogin()
    {  
        const res = await this.req.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data: this.payload
        });
    
        const loginRes = await res.json();
        const token = loginRes.token;
        return token;
    }

    async orderCreation(orderPayload) 
    {
        let response = {};
        response.token = await this.doLogin();
        const orderAPI = await this.req.post('https://rahulshettyacademy.com/api/ecom/order/create-order', 
        {
            data: orderPayload,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        });
    
        // expect(orderAPI.ok()).toBeTruthy();
        const responseJson = await orderAPI.json();
        response.orderID = responseJson.orders[0];
        return response;
    }
}

module.exports = {APIUtils};