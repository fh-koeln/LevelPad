'use strict';

var Comment = require('../models/Comment'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all comments by member and apply an optional filter.
 *
 * @param callback
 * @param member
 */
exports.list = function(callback, member) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}

			next(null, member);
		},
		function(member, next) {
			next(null, member.comments);
		}
	], callback);
};

/**
 * Find comment by member and comment id.
 *
 * @param callback
 * @param member
 * @param commentId
 */
exports.read = function(callback, member, commentId) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}

			next(null, member);
		},
		function(member, next) {
			var comment = member.comments.id(commentId);

			if (!comment) {
				return next(new errors.NotFoundError('comment'));
			}

			next(null, comment);
		}
	], callback);
};

/**
 * Create a new comment based on the given commentData.
 *
 * @param callback
 * @param member
 * @param commentData
 */
exports.create = function(callback, member, commentData) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}

			next(null, member);
		},
		function(member, next) {
			if (!commentData.createdBy) {
				return next(new errors.ArgumentNullError('createdBy'));
			}

			if (!commentData.comment) {
				return next(new errors.ArgumentNullError('comment'));
			}

			if (!commentData.task) {
				return next(new errors.ArgumentNullError('task'));
			}

			if (!commentData.text) {
				return next(new errors.ArgumentNullError('text'));
			}

			next(null, member);
		},
		function(member, next) {
			var comment = new Comment();

			comment.createdBy = commentData.createdBy;
			comment.comment = commentData.comment;
			comment.task = commentData.task;
			comment.text = commentData.text;

			member.comments.push(comment);

			member.save(function(err) {
				next(err, comment);
			});
		}
	], callback);
};

/**
 * Update an comment with given commentData.
 *
 * @param callback
 * @param member
 * @param commentData
 */
exports.update = function(callback, member, commentId, commentData) {
	async.waterfall([
		function(next) {
			exports.read(next, member, commentId);
		},
		function(comment, next) {
			if (commentData.createdBy !== undefined) {
				comment.createdBy = commentData.createdBy;
			}

			if (commentData.task !== undefined) {
				comment.task = commentData.task;
			}

			if (commentData.text !== undefined) {
				comment.text = commentData.text;
			}

			member.save(function(err) {
				next(err, comment);
			});
		}
	], callback);
};

/**
 * Remove an comment by member and comment id.
 *
 * @param callback
 * @param member
 * @param commentId
 */
exports.delete = function(callback, member, commentId) {
	async.waterfall([
		function(next) {
			exports.read(next, member, commentId);
		},
		function(comment, next) {
			comment.remove();

			next(null, comment);
		},
		function(comment, next) {
			member.save(function(err) {
				next(err, comment);
			});
		}
	], callback);
};
