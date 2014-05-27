
var express = require('express'),
	users = express.Router(),
	User = require('../models/User'),
	helpers = require('./_helpers');

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

/**
 * Get informations about the current user.
 */
users.get('/me', function(req, res) {
	res.json(200, req.user);
});

users.get('/:username', function(req, res) {
	User.findOne(req.params, helpers.sendResult(res));
});

users.put('/:username', function(req, res, next) {
	User.findOneAndUpdate(req.params, req.body, { upsert: true }, helpers.sendResult(res));
});

users.delete('/:username', function(req, res) {
	User.findOneAndRemove(req.params, req.body, helpers.sendResult(res));
});

module.exports = users;
