var express = require('express'),
	users = express.Router(),
	User = require('../models/User.js');

users.use(function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.status(401).end();
	} else {
		next();
	}
});

users.param('user', function(req, res, next, username) {
	User.findByUsername(username, function(err, user) {
		req.user = user;
		next();
	});
});

users.get('/', function(req, res, next) {
	User.find(function(err, users) {
		res.json(users);
	});
});

users.get('/:user', function(req, res, next) {
	res.json(req.user);
});

users.put('/:user', function(req, res, next) {
	res.send('update user ' + req.user._id);
});

users.delete('/:user', function(req, res, next) {
	res.send('destroy user ' + req.user._id);
});

module.exports = users;
