'use strict';

var Task = require('../models/Task'),
	async = require('async'),
	getSlug = require('speakingurl').createSlug({
		lang: 'de',
		truncate: 40
	}),
	errors = require('common-errors');

// Source: http://stackoverflow.com/a/11477986
function objectFindByKey(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return array[i];
		}
	}
	return null;
}

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

			next(null, subject);
		},
		function(subject, next) {
			next(null, subject.tasks);
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
			var task;
			if (taskId.match(/^[0-9a-fA-F]{24}$/)) { // ObjectID
				task = subject.tasks.id(taskId);
			} else {
				task = objectFindByKey(subject.tasks, 'slug', taskId);
			}

			if (!task) {
				return next(new errors.NotFoundError('Task'));
			}

			next(null, task);
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
				if (!subject || !subject._id) {
					return next(new errors.NotFoundError('Subject'));
				}

				next(null, subject);
			},
			function(subject, next) {
				if (!taskData.title) {
					return next(new errors.ArgumentNullError('title'));
				}

				if (!taskData.description) {
					return next(new errors.ArgumentNullError('description'));
				}

				if (!taskData.weight) {
					return next(new errors.ArgumentNullError('weight'));
				}

				next(null, subject);
			},
			function(subject, next) {
				var task = new Task();

				task.title = taskData.title;
				task.description = taskData.description;
				task.slug = getSlug(taskData.title),
				task.weight = taskData.weight;

				subject.tasks.push(task);

				subject.save(function(err) {
					next(err, task);
				});
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
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var task = subject.tasks.id(taskId);
			if (!task) {
				return next(new errors.NotFoundError('Task'));
			}

			next(null, task);
		},
		function(task, next) {
			if (taskData.title !== undefined) {
				task.title = taskData.title;
			}

			if (taskData.description !== undefined) {
				task.description = taskData.description;
			}

			if (taskData.weight !== undefined) {
				task.weight = taskData.weight;
			}

			next(null, task);
		},
		function(task, next) {
			subject.save(function(err) {
				next(err, task);
			});
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
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var task = subject.tasks.id(taskId);
			if (!task) {
				return next(new errors.NotFoundError('Task'));
			}

			task.remove();

			next(null, task);
		},
		function(task, next) {
			subject.save(function(err) {
				next(err, task);
			});
		}
	], callback);
};
