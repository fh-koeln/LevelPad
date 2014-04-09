'use strict';

var example = require('../api/example');

/**
 * Application routes
 */
module.exports = function(app, io) {

	// Server API Routes
	app.get('/api/example/awesomeThings', example.awesomeThings);
	
	// All undefined api routes should return a 404
	app.get('/api/*', function(req, res) {
		res.send(404);
	});
	
	io.sockets.on('connection', function (socket) {
		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});
};
