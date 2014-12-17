'use strict';

/**
 * RESTful API for levels.
 */

var express = require('express'),
	swag = require('bo-swag'),
	levels = swag.router(express.Router()),
	ModuleSubjectTaskLevelController = require('../controllers/ModuleSubjectTaskLevelController'),
	_helpers = require('./_helpers');

/**
 * Get all levels for the current subject.
 */
levels.get('/', {
	tags: [ 'Level' ]
}, function(req, res) {
	ModuleSubjectTaskLevelController.list(_helpers.sendResult(res), req.user, req.subject, req.task);
});

/**
 * Get one task for the current subject.
 */
levels.get('/:levelId', {
	tags: [ 'Level' ]
}, function(req, res) {
	ModuleSubjectTaskLevelController.read(_helpers.sendResult(res), req.user, req.subject, req.task, req.params.levelId);
});

/**
 * Update one task for the current subject.
 */
levels.put('/:levelId', {
	tags: [ 'Level' ]
}, function(req, res) {
	ModuleSubjectTaskLevelController.update(_helpers.sendResult(res), req.user, req.subject, req.task, req.params.levelId, req.body);
});

/**
 * Add a task to the current subject.
 */
levels.post('/', {
	tags: [ 'Level' ]
}, function(req, res) {
	ModuleSubjectTaskLevelController.create(_helpers.sendResult(res), req.user, req.subject, req.task, req.body);
});

/**
 * Remove a task from the current subject.
 */
levels.delete('/:levelId', {
	tags: [ 'Level' ]
}, function(req, res) {
	ModuleSubjectTaskLevelController.delete(_helpers.sendResult(res), req.user, req.subject, req.task, req.params.levelId);
});

module.exports = levels;
