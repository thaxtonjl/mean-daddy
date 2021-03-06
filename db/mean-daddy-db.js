(function () {
    'use strict';

    var _ = require('lodash');
    var config = require('../config');
    var MongoClient = require('mongodb').MongoClient;

    exports.getCollection   = getCollection;
    exports.getDB           = getDB;
    exports.getDBDump       = getDBDump;
    exports.insertOne       = insertOne;
    exports.primeDB         = primeDB;
    exports.updateOne       = updateOne;

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
                        db.close();
                        return dump;
                    });
            });
    }

    function insertOne(collectionName, newItem) {
        var rejectionReason;
        if (!collectionName || typeof collectionName !== 'string') {
            rejectionReason = 'Invalid collectionName: ' + JSON.stringify(collectionName);
        } else if (!newItem || typeof newItem !== 'object') {
            rejectionReason = 'Invalid newItem: ' + JSON.stringify(newItem);
        }
        if (rejectionReason) {
            return new Promise(function (resolve, reject) {
                reject(rejectionReason);
            });
        }
        return exports
            .getDB()
            .then(function (db) {
                return new Promise(function (resolve, reject) {
                    db
                        .collection(collectionName)
                        .insertOne(newItem, function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(_.get(result, 'ops[0]'));
                            }
                        });
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
            return Promise
                .all(promises)
                .then(function (result) {
                    db.close();
                    return result;
                });
        }

        function dropDatabase(db) {
            return db
                .dropDatabase()
                .then(_.constant(db));
        }

    }

    function updateOne(collectionName, _id, changedItem) {
        var rejectionReason;
        if (!collectionName || typeof collectionName !== 'string') {
            rejectionReason = 'Invalid collectionName: ' + JSON.stringify(collectionName);
        } else if (!_id || typeof _id !== 'string') {
            rejectionReason = 'Invalid _id: ' + JSON.stringify(_id);
        } else if (!changedItem || typeof changedItem !== 'object') {
            rejectionReason = 'Invalid changedItem: ' + JSON.stringify(changedItem);
        } else if (!changedItem.name && typeof changedItem.hasOwnProperty('name')) {
            rejectionReason = '"name" is required.';
        }
        if (rejectionReason) {
            return new Promise(function (resolve, reject) {
                reject(rejectionReason);
            });
        }
        return exports
            .getDB()
            .then(function (db) {
                return new Promise(function (resolve, reject) {
                    var criteria = {
                        _id: _id
                    };
                    var delta = {
                        $set: changedItem
                    };
                    db
                        .collection(collectionName)
                        .updateOne(criteria, delta, function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                db
                                    .collection(collectionName)
                                    .find(criteria)
                                    .toArray()
                                    .then(function (accounts) {
                                        var account = _.get(accounts, '[0]');
                                        if (account) {
                                            resolve(account);
                                        } else {
                                            return new Promise(function (resolve, reject) {
                                                reject('No account retrieved.');
                                            });
                                        }
                                    })
                                    .catch(function (err) {
                                        reject(err);
                                    });
                            }
                        });
                });
            });
    }

}());
