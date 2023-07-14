const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    paymentId : String,
    isPaid : Boolean,
    type : String,
    Date : Date,
}, { timestamps: true });


module.exports = mongoose.model('Payment', Schema)