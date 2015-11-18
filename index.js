var STATIC_PATH = __dirname + '/client/src';
var SERVER_PORT = process.env.PORT || 5000;
var DATABASE_URL = 'mongodb://localhost:27017/mean-daddy';
var REST_BASE = '/api';

var assert = require('assert');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(DATABASE_URL, function(err, db) {
    assert.equal(null, err);
    console.log('Connected correctly to server.');
    db.close();
});

var app = express();
app.use(express['static'](STATIC_PATH));
app.get(REST_BASE + '/accounts', function (req, res) {
    MongoClient.connect(DATABASE_URL, function(err, db) {
        assert.equal(null, err);
        console.log('/accounts');
        db
            .collection('accounts')
            .find()
            .toArray()
            .then(function (accounts) {
                res.send(accounts);
                db.close();
            });
    });
});
app.listen(SERVER_PORT, function () {
    console.log('Listening on ' + SERVER_PORT);
});
