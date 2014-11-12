
var Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all members by subject and apply an optional filter.
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

			Subject.findById(subject._id).select('members -_id').populate('members').exec(function(err, subjectWithMembers) {
				User.populate(subjectWithMembers, {
					path: 'members.user',
				}, function(err, subjectWithMembersAndUsers) {
					if (err) {
						return next(err);
					}

					next(null, subjectWithMembersAndUsers.members);
				});
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
exports.read = function(callback, subject, memberId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var memberExists = subject.members.some(function (member) {
			    return member.equals(memberId);
			});

			if (!memberExists) {
				return next(new errors.NotFoundError('Member'));
			}
			Member.findById(memberId, next);
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
exports.create = function(callback, subject, memberData) {
		async.waterfall([
			function(next) {
				if (!memberData.id) {
					return next(new errors.ArgumentNullError('id'));
				}

				if (!memberData.role) {
					return next(new errors.ArgumentNullError('role'));
				}

				next(null, subject);
			},
			function(subject, next) {
				if (!subject || !subject._id) {
					return next(new errors.NotFoundError('Subject'));
				}

				next(null, subject);
			},
			function(subject, next) {
				var member = new Member();

				member.user = memberData.id;
				member.subject = subject._id;
				member.role = memberData.role;

				member.save(function(err) {
					if (err) {
						return next(err);
					}
					subject.members.push(member._id);
					subject.save(next);
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
exports.update = function(callback, subject, memberId, memberData) {
	async.waterfall([
		function(next) {
			exports.read(next, subject, memberId);
		},
		function(member, next) {
			if (memberData.role !== undefined) {
				member.role = memberData.role;
			}
			member.save(next);
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
exports.delete = function(callback, subject, memberId) {
	async.waterfall([
		function(next) {
			exports.read(next, subject, memberId);
		},
		function(member, next) {
			member.remove(next);
		},
		function(member, next) {
			var indexedMember = subject.members.indexOf(member._id);
			subject.members.splice(indexedMember, 1);
			subject.save(next);
		}
	], callback);
};
