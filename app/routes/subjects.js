'use strict';

/**
 * RESTful API for subjects.
 */

var express = require('express'),
	swag = require('bo-swag'),
	subjects = swag.router(express.Router()),
	ModuleSubjectController = require('../controllers/ModuleSubjectController'),
	_helpers = require('./_helpers');

subjects.param('subjectSlug', function (req, res, next, subjectSlug) {
	ModuleSubjectController.read(function(err, subject) {
		if (err) {
			return _helpers.sendResult(res)(err);
		}

		req.subject = subject;
		next(err);
	}, req.user, req.module, subjectSlug);
});

/**
 * Get all subjects for a module.
 */
subjects.get('/', {
	summary: 'Get all subjects',
	description: 'List all subjects and apply optional filter.',
	tags: [ 'Subject' ],
}, function (req, res) {
	ModuleSubjectController.list(_helpers.sendResult(res), req.module);
});

/**
 * Create a new subject for a module.
 */
subjects.post('/', {
	summary: 'Create an subject',
	description: 'Create a new subject.',
	tags: [ 'Subject' ],
}, function (req, res) {
	req.body.creator = req.user._id;
	ModuleSubjectController.create(_helpers.sendResult(res), req.module, req.body);
});

/**
 * Read a subject for a module.
 */
subjects.get('/:subjectSlug', {
	summary: 'Get a subject',
	description: 'Get information about a subject.',
	tags: [ 'Subject' ],
}, function (req, res) {
	ModuleSubjectController.read(_helpers.sendResult(res), req.user, req.module, req.params.subjectSlug);
});

/**
 * Update a subject for a module.
 */
subjects.put('/:subjectSlug', {
	summary: 'Update a subject',
	description: 'Update an existing subject.',
	tags: [ 'Subject' ],
}, function (req, res) {
	ModuleSubjectController.update(_helpers.sendResult(res), req.module, req.params.subjectSlug, req.body);
});

/**
 * Delete a subject for a module.
 */
subjects.delete('/:subjectSlug', {
	summary: 'Delete an subject',
	description: 'Delete an existing subject.',
	tags: [ 'Subject' ],
}, function (req, res) {
	ModuleSubjectController.delete(_helpers.sendResult(res), req.module, req.params.subjectSlug);
});

/**
 * Register subresources for subjects.
 */
subjects.use('/:subjectSlug/tasks', require('./tasks'));
subjects.use('/:subjectSlug/members', require('./members'));

module.exports = subjects;
