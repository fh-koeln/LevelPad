'use strict';

/**
 * RESTful API for tasks.
 */

var express = require('express'),
	swag = require('bo-swag'),
	tasks = swag.router(express.Router()),
	ModuleSubjectTaskController = require('../controllers/ModuleSubjectTaskController'),
	helpers = require('./_helpers');

/**
 * Get all tasks for the current subject.
 */
tasks.get('/', {

}, function(req, res) {
	ModuleSubjectTaskController.list(helpers.sendResult(res), req.subject);
});

/**
 * Get one task for the current subject.
 */
tasks.get('/:taskId', {

}, function(req, res) {
	ModuleSubjectTaskController.read(helpers.sendResult(res), req.subject, req.params.taskId);
});

/**
 * Update one task for the current subject.
 */
tasks.put('/:taskId', {

}, function(req, res) {
	ModuleSubjectTaskController.update(helpers.sendResult(res), req.subject, req.params.taskId, req.body);
});

/**
 * Add a task to the current subject.
 */
tasks.post('/', {

}, function(req, res) {
	ModuleSubjectTaskController.create(helpers.sendResult(res), req.subject, req.body);
});

/**
 * Remove a task from the current subject.
 */
tasks.delete('/:taskId', {

}, function(req, res) {
	ModuleSubjectTaskController.delete(helpers.sendResult(res), req.subject, req.params.taskId);
});

module.exports = tasks;
