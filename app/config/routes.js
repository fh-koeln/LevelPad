'use strict';

var express = require('express');

var isAuthenticated = function(req, res, next) {
	return next(); // @todo remove
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
};

/**
 * Application routes
 */
module.exports = function(app, io) {

    var api = express.Router();
    api.use(isAuthenticated);

    app.use('/api', api);

    api.use('/subjects', require('../resources/Subjects'));
    api.use('/users', require('../resources/Users'));
    api.use('/accounts', require('../resources/Account'));

    /* GET home page for. */
    app.get('/*', function(req, res) {
        res.sendfile('index.html', { root: __dirname + '/../public' });
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
