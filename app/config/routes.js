'use strict';

var express = require('express');

var ExampleController = require('../api/ExampleController');

var ChatController = require('../api/ChatController');

var redirectBrowsersToIndex = function(req, res, next) {
	if (req.accepts('json', 'html') == 'html' && !req.path.match('.json$')) {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	} else {
		next();
	}
};

/**
 * Application routes
 */
module.exports = function(app, io) {

	//
	// For Angular JS we show always the index.html WHEN
	//
	// * The URL path does NOT end with ".json".
	// * The accept header does NOT contain a JSON accept header.
	//
	/*app.use(function(req, res, next) {
		if (req.accepts('json', 'html') == 'html' && !req.path.match('.json$')) {
			res.sendfile('index.html', { root: __dirname + '/../public' });
		} else {
			next();
		}
	});*/
	
	app.route('/users').all(redirectBrowsersToIndex);

	// Server API Routes
	app.get('/api/example/awesomeThings', ExampleController.awesomeThings);
	app.get('/chat', ChatController.index);
	
	app.resource( 'users', require( '../resources/Users'  ) );
	app.resource( 'subjects', require( '../resources/Subjects'  ) );
	app.resource( 'subjects/:subject/artifacts', require( '../resources/Artifacts'  ) );

	io.sockets.on('connection', function (socket) {
		console.log('new connection...');

		socket.broadcast.emit('chat_message', {
			type: 'message',
			text: 'hallo!'
		});

		socket.on('chat_message', function (data) {
			ChatController.receiveMessageIO(io, socket, data);
		});
	});
};
