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
	console.log( "Hey, redirectBrowsersToIndex." );
	if (req.accepts('json', 'html') == 'html' && !req.path.match('.json$')) {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	} else {
		next();
	}
};


var auth = function(req, res, next) {
	console.log( "Hey, authentifiziert." );
	next();
};

/**
 * Application routes
 */
module.exports = function(app, io) {

	// We could extend this routes later here..

	app.route('/users/*')
		.all(auth)
		.get(redirectBrowsersToIndex)
		.all(require('../resources/Users').users);

	app.route('/subjects/*')
		.all(auth)
		.get(redirectBrowsersToIndex)
		.all(require('../resources/Subjects').subjects);

	/*app.route('/subjects/:subject/artifacts/*')
		.all(auth)
		.get(redirectBrowsersToIndex)
		.all(require('../resources/Artifacts').artifacts);*/

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
