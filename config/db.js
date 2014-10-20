'use strict';

var mongoose = require('mongoose');

var env = process.env.NODE_ENV;

var mongoHost = process.env.MONGODB_HOST || process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost';
var mongoPort = process.env.MONGODB_PORT || process.env.MONGODB_PORT_27017_TCP_PORT || 27017;
var mongoDb = process.env.MONGODB_DB || (env === 'test' ? 'levelpadtest' : 'levelpad');

var mongoDbURL = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDb;

module.exports.url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || mongoDbURL;

console.log('Evaluated environment variables for mongodb URL: ' + module.exports.url);

// Connect to our database
mongoose.connect(module.exports.url);

// If the connection throws an error
mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err + '\nMongo server started?');
});

// When the connection is disconnected
mongoose.connection.on('connected', function () {
	console.log('Mongoose connection connected');
});

// When the connection is connected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose connection disconnected');
});

module.exports.connection = mongoose.connection;
