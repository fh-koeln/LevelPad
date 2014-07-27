
var express = require('express'),
	users = express.Router(),
	UserController = require('../controllers/UserController'),
	_helpers = require('../controllers/_helpers');

users.param('user', function(req, res, next, username) {
	UserController.getUser(function(err, user) {
		req.user = user;
		next(err);
	}, username);
});

users.get('/', function (req, res) {
	UserController.getAll(_helpers.sendResult(res));
});

users.post('/', function(req, res) {
	UserController.create(_helpers.sendResult(res), req.body);
});

/**
 * Get informations about the current user.
 */
users.get('/me', function(req, res) {
	if (req.user) {
		res.json(200, req.user);
	} else {
		res.json(404, { message: 'User not found...' });
	}
});

users.get('/:username', function(req, res) {
	UserController.getUser(_helpers.sendResult(res), req.params.username);
});

users.put('/:username', function(req, res) {
	UserController.update(_helpers.sendResult(res), req.params.username, req.body);
});

users.delete('/:username', function(req, res) {
	UserController.remove(_helpers.sendResult(res), req.params.username);
});

module.exports = users;
