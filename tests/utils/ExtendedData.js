const base = require("@playwright/test");

exports.customtest = base.test.extend(
    {
        testDataOrder : {
            username: "testspace@gmail.com",
            password: "Testspace@97",
            productName: "ZARA COAT 3"
        }
    }
)