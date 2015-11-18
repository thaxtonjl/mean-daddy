(function () {
    'use strict';

    var _ = require('lodash');
    var config = require('../config');
    var MongoClient = require('mongodb').MongoClient;

    exports.getCollection = getCollection;
    exports.getDB = getDB;
    exports.primeDB = primeDB;

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
            MongoClient.connect(config.DB_URL, function(err, db) {
                if (err) {
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }

    function primeDB() {

        return exports
            .getDB()
            .then(dropDatabase)
            .then(addCollections);

        function addCollections(db) {
            var collections = require('./primer-data');
            var promises = _.map(collections, function (collection, name) {
                return db
                    .collection(name)
                    .insertMany(collection);
            });
            return Promise.all(promises);
        }

        function dropDatabase(db) {
            return db
                .dropDatabase()
                .then(_.constant(db));
        }

    }

}());
