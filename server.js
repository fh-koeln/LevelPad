'use strict';

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 5000;

// Load and initialize express
var express = require('express'),
	app = express();

console.info('Will start server on port %d in %s mode...', port, app.get('env'));

// Express settings
require('./app/config/express')(app);

// Database
require('./app/config/db');

// Access Control Lists
require('./app/config/acl');

// Authentification
require('./app/config/auth')(app);

// Routing
app.use(require('./app/config/routes'));

// @todo
// Socket.io
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	console.log('new connection...');

	socket.broadcast.emit('chat_message', {
		type: 'message',
		text: 'hallo!'
	});

	socket.on('chat_message', function (data) {
		console.log(data);
	});
});


// Start server
server.listen(port, function() {
	console.info('Server started! Waiting for requests...');
});
