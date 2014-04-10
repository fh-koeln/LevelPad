'use strict';

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 5000;

// Load and initialize express
var express = require('express'),
	Resource = require('express-resource'),
	app = express();
console.info('Will start server on port %d in %s mode...', port, app.get('env'));

// Socket.io
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

// Express settings
require('./app/config/express')(app);

// Routing
require('./app/config/routes')(app, io);

// Start server
server.listen(port, function() {
	console.info('Server started! Waiting for requests...');
});
