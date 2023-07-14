const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    email: String,
    password : String,
    name: { type: String, default: 'John'},
    surname: { type: String, default: 'Doe'},
    discordId: String,
    photo: { type: String, default: 'https://icon-library.com/images/unknown-person-icon/unknown-person-icon-27.jpg'},
    userGuilds: {type: Object, default: []},
    loginToken: String,
    hasAccess: Boolean,
    accessDate: { type: String, default: 'noAccess'},
    serverIp: { type: String, default: 'none'},
    serverPort: { type: String, default: 'none'},
    serverAuthorization: String,
    ip: String,
    date: Date,
}, { timestamps: true });


module.exports = mongoose.model('User', Schema)