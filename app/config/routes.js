'use strict';

var ExampleController = require('../api/ExampleController');

var ChatController = require('../api/ChatController');

/**
 * Application routes
 */
module.exports = function(app, io) {

	// For URL changes when we switch the view/controller
	app.get('/', function(req, res) {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	});
	app.get('/chat', function(req, res) {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	});
	
	// Server API Routes
	app.get('/api/example/awesomeThings', ExampleController.awesomeThings);
	
	// All undefined api routes should return a 404
	app.get('/api/*', function(req, res) {
		res.send(404);
	});

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
