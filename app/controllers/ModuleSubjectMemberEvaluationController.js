'use strict';

var Evaluation = require('../models/Evaluation'),
	Member = require('../models/Member'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all members by subject and apply an optional filter.
 *
 * @param callback
 * @param subject
 */
exports.list = function(callback, member) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}
		},
		function(next) {
			Member.findById(member._id).exec(function(err, memberData) {
				if (err) {
					return next(err);
				}

				next(null, memberData.evaluations);
			});
		}
	], callback);
};

/**
 * Find member by subject and member id.
 *
 * @param callback
 * @param subject
 * @param memberId
 */
exports.read = function(callback, member, evaluationId) {
	async.waterfall([
		function(next) {
			if (!member || !member._id) {
				return next(new errors.NotFoundError('Member'));
			}

			next(null);
		},
		function(next) {
			var evaluation = member.evaluations.id(evaluationId);

			if (!evaluation) {
				return next(new errors.NotFoundError('Evaluation'));
			}

			next(null, evaluation);
		}
	], callback);
};

/**
 * Create a new member based on the given memberData.
 *
 * @param callback
 * @param subject
 * @param memberData
 */
exports.create = function(callback, member, evaluationData) {
		async.waterfall([
			function(next) {
				if (!member || !member._id) {
					return next(new errors.NotFoundError('Member'));
				}

				next(null);
			},
			function(next) {
				if (!evaluationData.createdBy) {
					return next(new errors.ArgumentNullError('createdBy'));
				}

				if (!evaluationData.task) {
					return next(new errors.ArgumentNullError('task'));
				}

				if (!evaluationData.level) {
					return next(new errors.ArgumentNullError('level'));
				}

				next(null);
			},
			function(next) {
				var evaluation = new Evaluation();

				evaluation.createdBy = evaluationData.createdBy;
				evaluation.task = evaluationData.task;
				evaluation.level = evaluationData.level;

				evaluation.save(function(err) {
					if (err) {
						return next(err);
					}
					member.evaluation.push(evaluation._id);
					evaluation.save(next);
				});

			}
		], callback);
};

/**
 * Update the member with given memberData.
 *
 * @param callback
 * @param subject
 * @param memberId
 * @param memberData
 */
exports.update = function(callback, member, evaluation, evaluationData) {
	async.waterfall([
		function(next) {
			exports.read(next, member, evaluation);
		},
		function(evaluation, next) {
			if (evaluationData.createdBy !== undefined) {
				evaluation.createdBy = evaluationData.createdBy;
			}

			if (evaluationData.task !== undefined) {
				evaluation.task = evaluationData.task;
			}

			if (evaluationData.level !== undefined) {
				evaluation.level = evaluationData.level;
			}

			evaluation.save(next);
		}
	], callback);
};

/**
 * Remove a member by subject and member id.
 *
 * @param callback
 * @param subject
 * @param memberId
 */
exports.delete = function(callback, member, evaluationId) {
	async.waterfall([
		function(next) {
			exports.read(next, member, evaluationId);
		},
		function(evaluation, next) {
			evaluation.remove(next);
		},
		function(evaluation, next) {
			member.save(next);
		}
	], callback);
};
