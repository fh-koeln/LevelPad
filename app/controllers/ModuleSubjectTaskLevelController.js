'use strict';

var Level = require('../models/Level'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all levels by subject and apply an optional filter.
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

			next(null, subject.levels);
		}
	], callback);
};

/**
 * Find level by subject and level id.
 *
 * @param callback
 * @param subject
 * @param levelId
 */
exports.read = function(callback, subject, levelId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var level = subject.levels.id(levelId);
			if (!level) {
				return next(new errors.NotFoundError('Level'));
			}

			next(null, level);
		}
	], callback);
};

/**
 * Create a new level based on the given levelData.
 *
 * @param callback
 * @param subject
 * @param levelData
 */
exports.create = function(callback, subject, levelData) {
		async.waterfall([
			function(next) {
				if (!subject || !subject._id) {
					return next(new errors.NotFoundError('Subject'));
				}

				next(null, subject);
			},
			function(subject, next) {
				if (!levelData.title) {
					return next(new errors.ArgumentNullError('title'));
				}

				if (!levelData.description) {
					return next(new errors.ArgumentNullError('description'));
				}

				next(null, subject);
			},
			function(subject, next) {
				var existingLevels = subject.levels,
					level = new Level(), maxRate;

				// Get the highest current rate (http://stackoverflow.com/a/4020842)
				maxRate = Math.max.apply( Math, existingLevels.map(function(level) {
					return level.rate;
				}));

				if (!maxRate) {
					maxRate = 0;
				}

				level.rank = maxRate + 1;
				level.title = levelData.title;
				level.description = levelData.description;
				if (levelData.isMinimum) {
					level.isMinimum = levelData.isMinimum;
				}

				subject.levels.push(level);

				subject.save(function(err) {
					next(err, level);
				});
			}
		], callback);
};

/**
 * Update the level with given levelData.
 *
 * @param callback
 * @param subject
 * @param levelId
 * @param levelData
 */
exports.update = function(callback, subject, levelId, levelData) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var level = subject.levels.id(levelId);
			if (!level) {
				return next(new errors.NotFoundError('Level'));
			}

			next(null, level);
		},
		function(level, next) {
			if (levelData.title !== undefined) {
				level.title = levelData.title;
			}
			if (levelData.description !== undefined) {
				level.description = levelData.description;
			}
			if (levelData.isMinimum !== undefined) {
				level.isMinimum = levelData.isMinimum;
			}
			next(null, level);
		},
		function(level, next) {
			subject.save(function(err) {
				next(err, level);
			});
		}
	], callback);
};

/**
 * Remove a level by subject and level id.
 *
 * @param callback
 * @param subject
 * @param levelId
 */
exports.delete = function(callback, subject, levelId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var level = subject.levels.id(levelId);
			if (!level) {
				return next(new errors.NotFoundError('Level'));
			}

			level.remove();

			next(null, level);
		},
		function(level, next) {
			subject.save(function(err) {
				next(err, level);
			});
		}
	], callback);
};
