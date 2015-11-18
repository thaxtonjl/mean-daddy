(function () {
    'use strict';

    exports.DB_URL = 'mongodb://localhost:27017/mean-daddy';
    exports.REST_BASE = '/api';
    exports.SERVER_PORT = process.env.PORT || 5000;
    exports.STATIC_PATH = __dirname + '/client/src';

}());
