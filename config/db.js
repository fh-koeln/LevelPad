'use strict';

var mongoose = require('mongoose');

var env = process.env.NODE_ENV;

if (env === 'test') {
	module.exports.url = 'mongodb://localhost/levelpadtest';
} else {
	module.exports.url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/levelpad';
}

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
