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
			if (err.name === 'ValidationError' || err.name === 'AlreadyInUseError' || err.name === 'ArgumentNullError' || err.name === 'TypeError') {
				return res.status(400).json(err);
			} else if (err.name === 'NotFoundError') {
				return res.status(404).json(err);
			} else {
				return res.status(500).json(err);
			}
		}

		req.subject = subject;
		next(err);
	}, req.module, subjectSlug);
});

/**
 * Get all subjects for a module.
 */
subjects.get('/', {

}, function (req, res) {
	ModuleSubjectController.list(_helpers.sendResult(res), req.module);
});

/**
 * Create a new subject for a module.
 */
subjects.post('/', {

}, function (req, res) {
	req.body.creator = req.user._id;
	ModuleSubjectController.create(_helpers.sendResult(res), req.module, req.body);
});

/**
 * Read a subject for a module.
 */
subjects.get('/:subjectSlug', {

}, function (req, res) {
	ModuleSubjectController.read(_helpers.sendResult(res), req.module, req.params.subjectSlug);
});

/**
 * Update a subject for a module.
 */
subjects.put('/:subjectSlug', {

}, function (req, res) {
	ModuleSubjectController.update(_helpers.sendResult(res), req.module, req.params.subjectSlug, req.body);
});

/**
 * Delete a subject for a module.
 */
subjects.delete('/:subjectSlug', {

}, function (req, res) {
	ModuleSubjectController.delete(_helpers.sendResult(res), req.module, req.params.subjectSlug);
});

/**
 * Register subresources for subjects.
 */
subjects.use('/:subjectSlug/tasks', require('./tasks'));
subjects.use('/:subjectSlug/members', require('./members'));

module.exports = subjects;
