(function () {
    'use strict';

    var STATIC_PATH = __dirname + '/../client/src';
    var SERVER_PORT = process.env.PORT || 5000;
    var REST_BASE = '/api';

    var express = require('express');
    var meanDaddyDB = require('../db/mean-daddy-db');

    exports.start = start;

    function start() {
        var app = express();
        app.use(express['static'](STATIC_PATH));
        app.get(REST_BASE + '/accounts', function (req, res) {
            meanDaddyDB
                .getCollection('accounts')
                .then(function (accounts) {
                    console.log('/accounts');
                    res.send(accounts);
                });
        });
        app.listen(SERVER_PORT, function () {
            console.log('Listening on ' + SERVER_PORT);
        });
    }

}());
