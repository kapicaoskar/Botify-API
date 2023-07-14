const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const FunctionSchema = require('../../db/Schemas/Functions.js');
const validateip = require('validate-ip');
const router = express.Router();

router.get("/informations/change", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { token , info_id , value, ip } = req.query;
    if(!token || !info_id || !ip || !value) return res.status(200).send({ resMessage: "Token , info , value or ip cant be none!" })
    if (!validateip(ip)) return res.status(200).send({ resMessage: "Ip is not real!" })
    const user = await UserSchema.findOne({ loginToken: token })
    if(!user) return res.status(200).send({ resMessage: "No user with such token!" })
    if(!user.ip === ip) return res.status(200).send({ resMessage: "Bad ip!" })
    const functions = await FunctionSchema.findOne({ loginToken: token })
    if(!functions) return res.status(200).send({ resMessage: "No user with such token" })
    //Naprawic to i dorobic if'a czy to istnieje functions.powitaniaid = value cos takiego mniej wiecej
    functions.save()
    res.status(200).send({ resMessage: "Changed to new value!" })
})



module.exports = router;