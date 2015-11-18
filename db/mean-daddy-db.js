(function () {
    'use strict';

    var MongoClient = require('mongodb').MongoClient;

    exports.URL = 'mongodb://localhost:27017/mean-daddy';
    exports.getCollection = getCollection;
    exports.getDB = getDB;

    function getCollection(name) {
        return exports
            .getDB()
            .then(function (db) {
                return db
                    .collection(name)
                    .find()
                    .toArray()
                    .then(function (collection) {
                        db.close();
                        return collection;
                    });
            });
    }

    function getDB() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(exports.URL, function(err, db) {
                if (err) {
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }

}());
