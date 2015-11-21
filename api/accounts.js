(function () {
    'use strict';

    var _ = require('lodash');
    var config = require('../config');
    var meanDaddyDB = require('../db/mean-daddy-db');

    exports.init = init;

    function init(app) {
        app.get(config.REST_BASE + '/accounts', getAccounts);
        app.post(config.REST_BASE + '/accounts', postAccounts);
    }

    function getAccounts(req, res) {
        console.log('GET:  ' + config.REST_BASE + '/accounts');
        meanDaddyDB
            .getCollection('accounts')
            .then(function (accounts) {
                res.send(accounts);
            });
    }

    function postAccounts(req, res) {
        console.log('POST: ' + config.REST_BASE + '/accounts');
        var newAccount = _.get(req, 'body');
        var failReason;
        if (!newAccount) {
            failReason = 'No POST body.';
        } else if (!newAccount.name || typeof newAccount.name !== 'string') {
            failReason = '"name" is required.';
        }
        if (failReason) {
            res
                .status(400)
                .send({
                    error: failReason
                });
        } else {
            _.defaults(newAccount, {
                balance: 0,
                dueAmount: 0,
                dueDate: null,
                overDueAmount: 0
            });
            meanDaddyDB
                .insertOne('accounts', newAccount)
                .then(function (result) {
                    res.send(result);
                })
                .catch(function (err) {
                    res
                        .status(500)
                        .send({
                            error: err
                        });
                });
        }
    }

}());
