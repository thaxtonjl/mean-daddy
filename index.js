var express = require('express');
var app = express();
var STATIC_PATH = __dirname + '/client/src';
var SERVER_PORT = process.env.PORT || 5000;
app.use(express['static'](STATIC_PATH));
app.listen(SERVER_PORT, function () {
    console.log('Listening on ' + SERVER_PORT);
});
