const express = require('express');
const router = express.Router();
const UserSchema = require('../../db/Schemas/User.js');
const FuncSchema = require('../../db/Schemas/Functions.js')
const TokenGenerator = require('token-generator')({ salt: '55', timestampMap: '1k45oj6x2l', });
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({ clientId: '1092417298813427744', clientSecret: 'UD1TiW4J0_CFfK5qPrvM3QHQh5XfSN6x', redirectUri: 'http://127.0.0.1:3000/dscprocess?type=register' });



router.get("/login", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { code, ip } = req.query
    try {
        const tokenData = await oauth.tokenRequest({ code: code, scope: 'identify guilds', grantType: 'authorization_code' });
        const accessToken = tokenData.access_token;
        const userData = await oauth.getUser(accessToken);
        const userGuilds = await oauth.getUserGuilds(accessToken)
        const photo = "https://cdn.discordapp.com/avatars/" + userData.id + "/" + userData.avatar + ".png"
        const email = userData.email
        const findedUser = await UserSchema.findOne({ email: email })
        if (findedUser) {
            if (!findedUser.password.includes(userData.id)) return res.send({ canLogin: false, isCreated: true })
            findedUser.ip = ip
            findedUser.photo = photo
            let realGuilds = []
            oauth.addMember({ accessToken: accessToken, botToken: "MTA5MjQxNzI5ODgxMzQyNzc0NA.GxJSJG.e0G2lEZl7lHPqm8P8kD8cGBJCt9iVqhCaHGTlY", guildId: "1092416809950511176", userId: userData.id,})
            await userGuilds.forEach(async (guild) => { if(guild.owner){ if (guild.icon === null){ guild.icon = "none"; realGuilds.push(guild)} else { const guildPhoto = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + ".png"; guild.icon = guildPhoto; realGuilds.push(guild)}}})
            findedUser.userGuilds = realGuilds
            findedUser.save()
            res.status(200).send({ loginToken: findedUser.loginToken, isCreated: true, canLogin: true })
        } else {
            const date = new Date;
            const loginToken = await TokenGenerator.generate() + date.getSeconds() + date.getMinutes();
            const discordPsswd = await TokenGenerator.generate() + userData.id + date.getSeconds() + date.getMinutes();
            const serverAuth = await TokenGenerator.generate() + date.getSeconds() + await TokenGenerator.generate() + date.getMinutes();
            let realGuilds = []
            oauth.addMember({ accessToken: accessToken, botToken: "MTA5MjQxNzI5ODgxMzQyNzc0NA.GxJSJG.e0G2lEZl7lHPqm8P8kD8cGBJCt9iVqhCaHGTlY", guildId: "1092416809950511176", userId: userData.id,})
            await userGuilds.forEach(async (guild) => { if(guild.owner){ if (guild.icon === null){ guild.icon = "none"; realGuilds.push(guild)} else { const guildPhoto = "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + ".png"; guild.icon = guildPhoto; realGuilds.push(guild)}}})
            const newUser = new UserSchema({ email: email, photo: photo, discordId: userData.id, hasAccess: false, userGuilds : realGuilds, password: discordPsswd, serverAuthorization: serverAuth, ip: ip, loginToken: loginToken, date: new Date(Date.now()) });
            newUser.save();
            const func = new FuncSchema({ loginToken: loginToken , ownerId: userData.id })
            func.save()
            res.status(200).send({ loginToken: loginToken, isCreated: true, canLogin: true })
        }
    } catch (err) { return res.send({ canLogin: false, isCreated: false }) }
})


module.exports = router;  