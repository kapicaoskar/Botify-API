const express = require('express');
const router = express.Router();
const PaymentSchema = require('../../db/Schemas/Payment.js');
const { CashBill } = require("node-payments-lib2.0");
const cashbill = new CashBill("your shop id", "your secret key", true)


router.get("/payments/create", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { type } = req.query
    if (type === "1month") {
        const payData = await cashbill.generate("Oplata uslugi TEST na 1 miesiąc", 19.99, "PLN")
        cashbill.setRedirectUrls(payData.id, `http://127.0.0.1:3000/?paytoken=${payData.id}`, 'http://127.0.0.1:3000/negativepayment');
        const newPayment = new PaymentSchema({ paymentId: payData.id, isPaid: false, Date: new Date(Date.now()), type: "1 Month" });
        newPayment.save();
        res.send({ redirectUrl: payData.redirectUrl })
    }
    if (type === "3months") {
        const payData = await cashbill.generate("Oplata uslugi TEST na 3 miesiące", 49.99, "PLN")
        cashbill.setRedirectUrls(payData.id, `http://127.0.0.1:3000/?paytoken=${payData.id}`, 'http://127.0.0.1:3000/negativepayment');
        const newPayment = new PaymentSchema({ paymentId: payData.id, isPaid: false, Date: new Date(Date.now()), type: "3 Months" });
        newPayment.save();
        res.send({ redirectUrl: payData.redirectUrl })
    }
})



module.exports = router;  