'use strict';

var express = require('express');

var ExampleController = require('../api/ExampleController');

var ChatController = require('../api/ChatController');

//
// For Angular JS we show always the index.html WHEN
//
// * The URL path does NOT end with ".json".
// * The accept header does NOT contain a JSON accept header.
//
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

	// We could extend this routes later here..
	
	app.route('/account').all(redirectBrowsersToIndex);
	app.route('/login').all(redirectBrowsersToIndex);
	app.route('/logout').all(redirectBrowsersToIndex);
	
	app.route('/chat').all(redirectBrowsersToIndex);
	app.route('/users').all(redirectBrowsersToIndex);
	app.route('/subject').all(redirectBrowsersToIndex);

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
