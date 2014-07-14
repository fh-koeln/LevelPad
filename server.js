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

if (process.env.NODE_ENV !== 'test') {
	console.info('Will start server on port %d in %s mode...', port, app.get('env'));
} else {
	console.info('Provide test server for unit tests...');
}

// Express settings
require('./config/express')(app);

// Database
require('./config/db');

// Access Control Lists
require('./config/acl');

// Authentification
require('./config/auth')(app);

// Routing
app.use(require('./config/routes'));

var server = require('http').createServer(app);

// Start server
if (process.env.NODE_ENV !== 'test') {
	server.listen(port, function() {
		console.info('Server started! Waiting for requests...');
	});
}

module.exports = server;
