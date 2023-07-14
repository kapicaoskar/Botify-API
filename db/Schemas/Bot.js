const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    loginToken : String,
    ownerId : String,
    botClientId : String,
    botToken : String,
}, { timestamps: true });


module.exports = mongoose.model('Bot', Schema)