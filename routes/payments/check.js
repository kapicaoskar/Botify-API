const express = require('express');
const router = express.Router();
const PaymentSchema = require('../../db/Schemas/Payment.js');
const UserSchema = require('../../db/Schemas/User.js');
const { CashBill } = require("node-payments-lib2.0");
const cashbill = new CashBill("your shop id", "your secret key", true)


router.get("/payments/check", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { loginToken, paymentToken } = req.query
    if (!loginToken || !paymentToken) return res.send("You can't do that!")
    const findedPayment = await PaymentSchema.findOne({ paymentId: paymentToken })
    if (!findedPayment) return res.send({ doesExist: false })
    if (findedPayment.isPaid === true) return res.send({ doesExist: true, status: "alreadyPayed" })
    const payInfo = await cashbill.getPaymentInfo(paymentToken)
    if (payInfo.status === "PositiveFinish" || payInfo.status === "Rebill") {
        findedPayment.isPaid = true
        findedPayment.save()
        if (findedPayment.type === "1 Month") {
            const findedUser = await UserSchema.findOne({ loginToken: loginToken })
            findedUser.hasAccess = true
            const today = new Date()
            const formattedMonth = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
            if (findedUser.accessDate === "noAccess") {
                findedUser.accessDate = formattedMonth.getTime()
                findedUser.save()
                res.send({ doesExist: true, status: "added1month" })
            } else {
                const leftTime = findedUser.accessDate - today.getTime()
                findedUser.accessDate = formattedMonth.getTime() + (leftTime)
                findedUser.save()
                res.send({ doesExist: true, status: "added1month" })
            }
        }
        if (findedPayment.type === "3 Months") {
            const findedUser = await UserSchema.findOne({ loginToken: loginToken })
            findedUser.hasAccess = true
            const today = new Date()
            const formattedMonth = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000))
            if (findedUser.accessDate === "noAccess") {
                findedUser.accessDate = formattedMonth.getTime()
                findedUser.save()
                res.send({ doesExist: true, status: "added3months" })
            } else {
                const leftTime = findedUser.accessDate - today.getTime()
                findedUser.accessDate = formattedMonth.getTime() + (leftTime)
                findedUser.save()
                res.send({ doesExist: true, status: "added3months" })
            }
        }
    } else {
        res.send({ doesExist: true, status: "notPayed" })
    }

})



module.exports = router;