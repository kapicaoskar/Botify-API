const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    loginToken : {type : String , default: "None"},
    ownerId : {type : String , default: "None"},
    botClientId : {type : String , default: "None"},
    botToken : {type : String , default: "None"},
    powitaniaId : {type : String , default: "None"},
    pozegnaniaId : {type : String , default: "None"},
}, { timestamps: true });


module.exports = mongoose.model('Functions', Schema)