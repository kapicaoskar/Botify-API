console.clear()
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const app = express();
const cron = require('node-cron');
const connect = require('./db/connect.js');
const scheduler = require('./other/scheduler.js');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes', file));
        app.use(router);
    }
});


fs.readdirSync(path.join(__dirname, 'routes/payments')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes/payments', file));
        app.use(router);
    }
});


fs.readdirSync(path.join(__dirname, 'routes/login')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes/login', file));
        app.use(router);
    }
});



fs.readdirSync(path.join(__dirname, 'routes/informations')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes/informations', file));
        app.use(router);
    }
});



cron.schedule('0 */30 * * * *', scheduler.checkKeys);



app.listen(4000, () => {
    connect()
    app.use(cors())
    console.log("Api wystartowalo! https://localhost:4000")
})