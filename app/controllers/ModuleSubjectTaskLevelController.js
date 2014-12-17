'use strict';

var Level = require('../models/Level'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all levels by subject and apply an optional filter.
 *
 * @param callback
 * @param authUser
 * @param subject
 */
exports.list = function(callback, authUser, subject, task) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			if (!task || !task._id) {
				return next(new errors.NotFoundError('Task'));
			}

			next(null, task.levels);
		}
	], callback);
};

/**
 * Find level by subject and level id.
 *
 * @param callback
 * @param authUser
 * @param subject
 * @param levelId
 */
exports.read = function(callback, authUser, subject, task, levelId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			if (!task || !task._id) {
				return next(new errors.NotFoundError('Task'));
			}

			next(null);
		},
		function(next) {
			var level = task.levels.id(levelId);

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
 * @param authUser
 * @param subject
 * @param levelData
 */
exports.create = function(callback, authUser, subject, task, levelData) {
		async.waterfall([
			function(next) {
				if (!subject || !subject._id) {
					return next(new errors.NotFoundError('Subject'));
				}

				if (!task || !task._id) {
					return next(new errors.NotFoundError('Task'));
				}

				next(null);
			},
			function(next) {
				if (!levelData.title) {
					return next(new errors.ArgumentNullError('title'));
				}

				if (!levelData.description) {
					return next(new errors.ArgumentNullError('description'));
				}

				next(null);
			},
			function(next) {
				var existingLevels = task.levels,
					level = new Level(), maxRank;

				if (existingLevels.length > 0) {
					// Get the highest current rank (http://stackoverflow.com/a/4020842)
					maxRank = Math.max.apply( Math, existingLevels.map(function(level) {
						return level.rank;
					}));
				} else {
					maxRank = 0;
				}

				level.rank = maxRank + 1;
				level.title = levelData.title;
				level.description = levelData.description;
				if (levelData.isMinimum) {
					level.isMinimum = levelData.isMinimum;
				}

				task.levels.push(level);

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
 * @param authUser
 * @param subject
 * @param levelId
 * @param levelData
 */
exports.update = function(callback, authUser, subject, task, levelId, levelData) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			if (!task || !task._id) {
				return next(new errors.NotFoundError('Task'));
			}

			next(null);
		},
		function(next) {
			var level = task.levels.id(levelId);
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
			if (levelData.rank !== undefined) {
				level.rank = levelData.rank;
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
 * @param authUser
 * @param subject
 * @param levelId
 */
exports.delete = function(callback, authUser, subject, task, levelId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			if (!task || !task._id) {
				return next(new errors.NotFoundError('Task'));
			}

			next(null);
		},
		function(next) {
			var level = task.levels.id(levelId);
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
