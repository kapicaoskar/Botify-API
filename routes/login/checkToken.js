const express = require('express');
const UserSchema = require('../../db/Schemas/User.js');
const FunctionSchema = require('../../db/Schemas/Functions.js');
const validateip = require('validate-ip');
const router = express.Router();

router.get("/login/checktoken", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { token, ip } = req.query
    if (!validateip(ip) || !token) return res.status(400).send({ resMessage: "Bad token or ip!" })
    const findedToken = await UserSchema.findOne({ loginToken: token })
    if (!findedToken) return res.status(400).send({ resMessage: "notfound" })
    const functions = await FunctionSchema.findOne({ loginToken: token })
    if (!functions) return res.status(400).send({ resMessage: "badfunctions" })
    if (findedToken.ip === ip) return res.status(200).send({ resMessage: "correctToken", email: findedToken.email, name: findedToken.name, surname: findedToken.surname, userGuilds: findedToken.userGuilds, photo: findedToken.photo, hasAccess: findedToken.hasAccess, accessDate: findedToken.accessDate, serverIp: findedToken.serverIp, serverPort: findedToken.serverPort, serverAuthorization: findedToken.serverAuthorization, functions: functions })
    res.status(200).send({ resMessage: "badip" })
})


module.exports = router;
