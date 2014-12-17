'use strict';

/**
 * RESTful API for tasks.
 */

var express = require('express'),
	swag = require('bo-swag'),
	tasks = swag.router(express.Router()),
	ModuleSubjectTaskController = require('../controllers/ModuleSubjectTaskController'),
	_helpers = require('./_helpers');

tasks.param('taskId', function (req, res, next, taskId) {
	ModuleSubjectTaskController.read(function(err, task) {
		if (err) {
			return _helpers.sendResult(res)(err);
		}

		req.task = task;
		next(err);
	}, req.user, req.subject, taskId);
});

/**
 * Get all tasks for the current subject.
 */
tasks.get('/', {
	summary: 'Get all tasks',
	description: 'List all tasks and apply optional filter.',
	tags: [ 'Task' ],
}, function(req, res) {
	ModuleSubjectTaskController.list(_helpers.sendResult(res), req.user, req.subject);
});

/**
 * Get one task for the current subject.
 */
tasks.get('/:taskId', {
	summary: 'Get a task',
	description: 'Get information about a task.',
	tags: [ 'Task' ],
}, function(req, res) {
	ModuleSubjectTaskController.read(_helpers.sendResult(res), req.user, req.subject, req.params.taskId);
});

/**
 * Update one task for the current subject.
 */
tasks.put('/:taskId', {
	summary: 'Update a task',
	description: 'Update an existing task.',
	tags: [ 'Task' ],
}, function(req, res) {
	ModuleSubjectTaskController.update(_helpers.sendResult(res), req.user, req.subject, req.params.taskId, req.body);
});

/**
 * Add a task to the current subject.
 */
tasks.post('/', {
	summary: 'Create a task',
	description: 'Create a new task.',
	tags: [ 'Task' ],
}, function(req, res) {
	ModuleSubjectTaskController.create(_helpers.sendResult(res), req.user, req.subject, req.body);
});

/**
 * Remove a task from the current subject.
 */
tasks.delete('/:taskId', {
	summary: 'Delete a task',
	description: 'Delete an existing task.',
	tags: [ 'Task' ],
}, function(req, res) {
	ModuleSubjectTaskController.delete(_helpers.sendResult(res), req.user, req.subject, req.params.taskId);
});

/**
 * Register subresources for tasks.
 */
tasks.use('/:taskId/levels', require('./levels'));

module.exports = tasks;
