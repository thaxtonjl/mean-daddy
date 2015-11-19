(function () {
    'use strict';

    var _ = require('lodash');
    var bodyParser = require('body-parser');
    var config = require('../config');
    var express = require('express');
    var fs = require('fs');
    var meanDaddyDB = require('../db/mean-daddy-db');

    exports.start = start;

    function returnError(res, status, err) {
        res
            .status(status || 500)
            .send({
                error: err
            });
    }

    function returnSuccessNoContent(res) {
        res
            .status(204)
            .end();
    }

    function start() {
        var app = express();
        app.use(express['static'](config.STATIC_PATH));
        app.use(bodyParser.json()); // for parsing application/json
        app.get(config.REST_BASE + '/accounts', function (req, res) {
            console.log('GET:  ' + config.REST_BASE + '/accounts');
            meanDaddyDB
                .getCollection('accounts')
                .then(function (accounts) {
                    res.send(accounts);
                });
        });
        app.post(config.REST_BASE + '/actions', function (req, res) {
            console.log('POST: ' + config.REST_BASE + '/actions');
            var name = _.get(req, 'body.name');
            if (name === 'backupDatabase') {
                meanDaddyDB
                    .getDBDump()
                    .then(_.partial(writeJSONFile, config.DATA_FILE))
                    .then(_.partial(returnSuccessNoContent, res))
                    .catch(_.partial(returnError, res, 500));
            } else {
                returnError(res, 400, 'Unknown Action');
            }
        });
        app.listen(config.SERVER_PORT, function () {
            console.log('Listening on ' + config.SERVER_PORT);
        });
    }

    function writeJSONFile(fileName, data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data, null, 2);
        }
        return new Promise(function (resolve, reject) {
            fs.writeFile(fileName, data, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

}());
