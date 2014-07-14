
var express = require('express'),
	users = express.Router(),
	User = require('../../models/User'),
	helpers = require('../_helpers'),
	acl = require('../../../config/acl');

users.param('user', function(req, res, next, username) {
	User.findByUsername(username, function(err, user) {
		req.user = user;
		next();
	});
});

/**
 * Get all users
 */
users.get('/', function(req, res) {
	User.find(helpers.sendResult(res));
});

users.post('/', function(req, res) {
	var user = new User(req.body);

	user.role = 'student';

	user.save(function(err, user) {
		if (err) {
			res.json(500, err);
		} else {
			acl.setRole(user.username, user.role, function(err) {
				if (err) {
					res.json(500, err);
				} else {
					res.json(200, user);
				}
			});
		}
	});
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
	User.findOne(req.params, helpers.sendResult(res));
});

users.put('/:username', function(req, res) {
	User.findOneAndUpdate(req.params, req.body, { upsert: true }, helpers.sendResult(res));
});

users.delete('/:username', function(req, res) {
	User.findOneAndRemove(req.params, helpers.sendResult(res));
});

module.exports = users;
