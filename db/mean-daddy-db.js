(function () {
    'use strict';

    var _ = require('lodash');
    var config = require('../config');
    var MongoClient = require('mongodb').MongoClient;

    exports.getCollection = getCollection;
    exports.getDB = getDB;
    exports.getDBDump = getDBDump;
    exports.getDBDump = getDBDump;
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

    function getDBDump() {
        return exports
            .getDB()
            .then(function (db) {
                var dump = {};
                return db
                    .listCollections()
                    .toArray()
                    .then(function (collectionList) {
                        var promises = _.chain(collectionList)
                            .map(function (col) {
                                return col.name;
                            })
                            .filter(function (collectionName) {
                                return collectionName.substring(0, 7) !== 'system.';
                            })
                            .map(function (collectionName) {
                                return db
                                    .collection(collectionName)
                                    .find()
                                    .toArray()
                                    .then(function (collection) {
                                        dump[collectionName] = collection;
                                    });
                            })
                            .value();
                        return Promise.all(promises);
                    })
                    .then(function () {
                        return dump;
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
