
var express = require('express'),
	tasks = express.Router(),
	Task = require('../../../../models/Task'),
	helpers = require('../../../_helpers');

/**
 * Get all tasks for the current subject.
 */
tasks.get('/', function(req, res) {
	Task.find(helpers.sendResult(res));
});

/**
 * Get one task for the current subject.
 */
tasks.get('/:slug', function(req, res) {
	Task.findOne(req.params, helpers.sendResult(res));
});

/**
 * Create a new task for the current subject.
 */
tasks.post('/', function(req, res) {
	req.body.slug = 1;

	new Task(req.body).save(helpers.sendResult(res));
});

/**
 * Update task for the current subject.
 */
tasks.put('/:slug', function(req, res) {
	// TODO: Verify that the ID and the slug is not changed!?
	req.body.slug = req.params.slug;

	Task.findOneAndUpdate(req.params, req.body, helpers.sendResult(res));
});

/**
 * Delete task for the current subject.
 */
tasks.delete('/:slug', function(req, res) {
	Task.findOneAndRemove(req.params, helpers.sendResult(res));
});

module.exports = tasks;
