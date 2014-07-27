
var express = require('express'),
	users = express.Router(),
	UserController = require('../controllers/UserController'),
	_helpers = require('../controllers/_helpers');

// TODO check if we could replace the :username param in update and or delete below.
users.param('user', function(req, res, next, username) {
	UserController.getUser(function(err, user) {
		req.user = user;
		next(err);
	}, username);
});

/**
 * List all users and apply optional filter.
 */
users.get('/', function (req, res) {
	UserController.list(_helpers.sendResult(res));
});

/**
 * Find user by username.
 */
users.get('/:username', function(req, res) {
	UserController.read(_helpers.sendResult(res), req.params.username);
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

/**
 * Create a new user based on the given username.
 */
users.post('/', function(req, res) {
	UserController.create(_helpers.sendResult(res), req.body);
});

/**
 * Update the user with given username. The userdata are optional
 * and the username ifself could not changed (currently).
 */
users.put('/:username', function(req, res) {
	UserController.update(_helpers.sendResult(res), req.params.username, req.body);
});

/**
 * Removes the user with the given username.
 */
users.delete('/:username', function(req, res) {
	UserController.remove(_helpers.sendResult(res), req.params.username);
});

module.exports = users;
