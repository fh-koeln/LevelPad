'use strict';

/**
 * RESTful API for users.
 */

var express = require('express'),
	swag = require('bo-swag'),
	users = swag.router(express.Router()),
	UserController = require('../controllers/UserController'),
	UserSubjectController = require('../controllers/UserSubjectController'),
	_helpers = require('./_helpers');

users._spec.addDefinition('User', {
	properties: {
		username: { type: String, example: 'mmuster' },
		firstname: { type: String, example: 'Max' },
		lastname: { type: String, example: 'Mustermann' }
	}
});

// TODO check if we could replace the :username param or delete below.
users.param('user', function(req, res, next, username) {
	UserController.read(function(err, user) {
		if (err) {
			if (err.name === 'ValidationError' || err.name === 'AlreadyInUseError' || err.name === 'ArgumentNullError' || err.name === 'TypeError') {
				return res.status(400).json(err);
			} else if (err.name === 'NotFoundError') {
				return res.status(404).json(err);
			} else {
				return res.status(500).json(err);
			}
		}

		req.user = user;
		next(err);
	}, username);
});

/**
 * List all users and apply optional filter.
 */
users.get('/', {
	summary: 'Get all users',
	description: 'List all users and apply optional filter.',
	parameters: [ {
		name: 'username',
		in: 'query',
		type: 'string',
		description: 'Username',
		required: false
	}, {
		name: 'lastname',
		in: 'query',
		type: 'string',
		description: 'Lastname',
		required: false
	}, {
		name: 'firstname',
		in: 'query',
		type: 'string',
		description: 'Firstname',
		required: false
	} ],
	tags: [ 'User' ],
	responses: {
		200: {
			description: 'List of users',
			schema: {
				type: 'array',
				items: {
					$ref: 'User'
				}
			}
		},
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: 'Error'
			}
		}
	}
}, function (req, res) {
	UserController.list(_helpers.sendResult(res));
});


/**
 * Get informations about the current user.
 */
users.get('/me', {
	summary: 'Get current user',
	description: 'Get informatins about the current user.',
	tags: [ 'User' ],
	responses: {
		200: {
			description: 'Current users',
			schema: {
				$ref: 'User'
			}
		},
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: 'Error'
			}
		}
	}
}, function(req, res) {
	if (req.user) {
		res.status(200).json(req.user);
	} else {
		res.status(404).json({ error: 'User not found' });
	}
});

/**
 * Find user by username.
 */
users.get('/:username', {
	summary: 'Get an user',
	description: 'Get information about a user.',
	tags: [ 'User' ],
}, function(req, res) {
	UserController.read(_helpers.sendResult(res), req.params.username);
});

/**
 * Create a new user based on the given userdata.
 */
users.post('/', {
	summary: 'Create an user',
	description: 'Create a new user.',
	tags: [ 'User' ],
}, function(req, res) {
	UserController.create(_helpers.sendResult(res), req.body);
});

/**
 * Update the user with given username. userdata properties are optional
 * and the username ifself could not changed (currently).
 */
users.put('/:username', {
	summary: 'Update an user',
	description: 'Update an existing user.',
	tags: [ 'User' ],
}, function(req, res) {
	UserController.update(_helpers.sendResult(res), req.params.username, req.body);
});

/**
 * Removes the user with the given username.
 */
users.delete('/:username', {
	summary: 'Delete an user',
	description: 'Delete an existing user.',
	tags: [ 'User' ],
}, function(req, res) {
	UserController.delete(_helpers.sendResult(res), req.params.username);
});

/**
 * List all subjects for the given username.
 */
users.get('/:username/subjects', {
	summary: 'Get subjects of an user',
	description: 'Returns a list of subjects for an existing user.',
	tags: [ 'User' ],
}, function (req, res) {
	UserSubjectController.list(_helpers.sendResult(res), req.params.username);
});

module.exports = users;
