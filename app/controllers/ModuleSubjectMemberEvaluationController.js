'use strict';

var Evaluation = require('../models/Evaluation'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all evaluations by member and apply an optional filter.
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
			next(null, member.evaluation);
		}
	], callback);
};

/**
 * Find evaluation by member and evaluation id.
 *
 * @param callback
 * @param member
 * @param evaluationId
 */
exports.read = function(callback, member, evaluationId) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}

			next(null, member);
		},
		function(member, next) {
			var evaluation = member.evaluations.id(evaluationId);

			if (!evaluation) {
				return next(new errors.NotFoundError('Evaluation'));
			}

			next(null, evaluation);
		}
	], callback);
};

/**
 * Create a new evaluation based on the given evaluationData.
 *
 * @param callback
 * @param member
 * @param evaluationData
 */
exports.create = function(callback, member, evaluationData) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}

			next(null, member);
		},
		function(member, next) {
			if (!evaluationData.createdBy) {
				return next(new errors.ArgumentNullError('createdBy'));
			}

			if (!evaluationData.comment) {
				return next(new errors.ArgumentNullError('comment'));
			}

			if (!evaluationData.task) {
				return next(new errors.ArgumentNullError('task'));
			}

			if (!evaluationData.level) {
				return next(new errors.ArgumentNullError('level'));
			}

			next(null, member);
		},
		function(member, next) {
			var evaluation = new Evaluation();

			evaluation.createdBy = evaluationData.createdBy;
			evaluation.comment = evaluationData.comment;
			evaluation.task = evaluationData.task;
			evaluation.level = evaluationData.level;

			member.evaluation.push(evaluation);

			member.save(function(err) {
				next(err, evaluation);
			});
		}
	], callback);
};

/**
 * Update an evaluation with given evaluationData.
 *
 * @param callback
 * @param member
 * @param evaluationData
 */
exports.update = function(callback, member, evaluationId, evaluationData) {
	async.waterfall([
		function(next) {
			exports.read(next, member, evaluationId);
		},
		function(evaluation, next) {
			if (evaluationData.createdBy !== undefined) {
				evaluation.createdBy = evaluationData.createdBy;
			}

			if (evaluationData.comment !== undefined) {
				evaluation.comment = evaluationData.comment;
			}

			if (evaluationData.task !== undefined) {
				evaluation.task = evaluationData.task;
			}

			if (evaluationData.level !== undefined) {
				evaluation.level = evaluationData.level;
			}

			member.save(function(err) {
				next(err, evaluation);
			});
		}
	], callback);
};

/**
 * Remove an evaluation by member and evaluation id.
 *
 * @param callback
 * @param member
 * @param evaluationId
 */
exports.delete = function(callback, member, evaluationId) {
	async.waterfall([
		function(next) {
			exports.read(next, member, evaluationId);
		},
		function(evaluation, next) {
			evaluation.remove();

			next(null, evaluation);
		},
		function(evaluation, next) {
			member.save(function(err) {
				next(err, evaluation);
			});
		}
	], callback);
};
