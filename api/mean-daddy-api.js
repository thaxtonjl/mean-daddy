(function () {
    'use strict';

    var config = require('../config');
    var express = require('express');
    var meanDaddyDB = require('../db/mean-daddy-db');

    exports.start = start;

    function start() {
        var app = express();
        app.use(express['static'](config.STATIC_PATH));
        app.get(config.REST_BASE + '/accounts', function (req, res) {
            meanDaddyDB
                .getCollection('accounts')
                .then(function (accounts) {
                    console.log('/accounts');
                    res.send(accounts);
                });
        });
        app.listen(config.SERVER_PORT, function () {
            console.log('Listening on ' + config.SERVER_PORT);
        });
    }

}());
