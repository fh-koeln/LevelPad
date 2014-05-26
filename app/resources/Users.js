var express = require('express'),
	users = express.Router(),
	User = require('../models/User.js');

users.use(function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.json(401, {error: 'Not authenticated'});
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
		if (!err && users) {
			res.json(users);
		} else if (!err) {
			res.json([]);
		} else {
			console.log(err);
			next();
		}
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
