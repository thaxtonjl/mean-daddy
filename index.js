(function () {
    'use strict';

    var meanDaddyAPI = require('./api/mean-daddy-api');
    var meanDaddyDB = require('./db/mean-daddy-db');

    meanDaddyDB
        .primeDB()
        .then(meanDaddyAPI.start);

}());
