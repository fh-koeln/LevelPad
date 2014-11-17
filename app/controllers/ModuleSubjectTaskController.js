
var Task = require('../models/Task'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all tasks by subject and apply an optional filter.
 *
 * @param callback
 * @param subject
 */
exports.list = function(callback, subject) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			// TODO
			next();
		}
	], callback);
};

/**
 * Find task by subject and task id.
 *
 * @param callback
 * @param subject
 * @param taskId
 */
exports.read = function(callback, subject, taskId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			// TODO
			next();
		}
	], callback);
};

/**
 * Create a new task based on the given taskData.
 *
 * @param callback
 * @param subject
 * @param taskData
 */
exports.create = function(callback, subject, taskData) {
		async.waterfall([
			function(next) {
				// TODO
				next();
			}
		], callback);
};

/**
 * Update the task with given taskData.
 *
 * @param callback
 * @param subject
 * @param taskId
 * @param taskData
 */
exports.update = function(callback, subject, taskId, taskData) {
	async.waterfall([
		function(next) {
			// TODO
			next();
		}
	], callback);
};

/**
 * Remove a task by subject and task id.
 *
 * @param callback
 * @param subject
 * @param taskId
 */
exports.delete = function(callback, subject, taskId) {
	async.waterfall([
		function(next) {
			// TODO
			next();
		}
	], callback);
};
