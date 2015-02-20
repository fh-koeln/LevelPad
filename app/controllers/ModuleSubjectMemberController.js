'use strict';

var Member = require('../models/Member'),
	User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors'),
	acl = require('../../config/acl').instance;

/**
 * List all members by subject and apply an optional filter.
 *
 * @param callback
 * @param authUser
 * @param subject
 */
exports.list = function(callback, authUser, subject, queryArgs) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			var filter = {};
			filter._id = { $in : subject.members };

			if ( queryArgs.role ) {
				filter.role = queryArgs.role;
			}

			Member.find(filter).populate('user').exec(function(err, members) {
				if (err) {
					return next(err);
				}

				next(null, members);
			});
		}
	], callback);
};

/**
 * Find member by subject and member id.
 *
 * @param callback
 * @param authUser
 * @param subject
 * @param memberId
 */
exports.read = function(callback, authUser, subject, memberId) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			var memberExists;
			try {
				memberExists = subject.members.some(function (member) {
					return member.equals(memberId);
				});
			} catch (e) {
				return next(new errors.TypeError('Member ID must be a single String of 12 bytes or a string of 24 hex characters'));
			}

			if (!memberExists) {
				return next(new errors.NotFoundError('Member'));
			}

			Member.findById(memberId).populate('user').exec(function(err, member) {
				if (err) {
					return next(err);
				}

				next(null, member);
			});
		}
	], callback);
};

/**
 * Create a new member based on the given memberData.
 *
 * @param callback
 * @param authUser
 * @param subject
 * @param memberData
 */
exports.create = function(callback, authUser, subject, memberData) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

			next(null, subject);
		},
		function(subject, next) {
			if (subject.registrationPassword) {
				if (!memberData.registrationPassword) {
					return next(new errors.ArgumentNullError('registrationPassword'));
				} else if (memberData.registrationPassword !== subject.registrationPassword) {
					return next(new errors.AuthenticationRequiredError('Das eingegebene Passwort ist falsch.'));
				}
			}

			next(null, subject);
		},
		function(subject, next) {
			if (!memberData.id) {
				return next(new errors.ArgumentNullError('id'));
			}

			if (!memberData.role) {
				return next(new errors.ArgumentNullError('role'));
			}

			next(null, subject);
		},
		function(subject, next) {
			User.findById(memberData.id, function(err, user) {
				if (err) {
					return next(err);
				}

				return next(null, subject, user);
			});
		},
		function(subject, user, next) {
			var member = new Member();

			member.user = user._id;
			member.subject = subject._id;
			member.role = memberData.role;

			member.save(function(err) {
				if (err) {
					return next(err);
				}

				subject.members.push(member._id);
				subject.save(function(err, subject) {
					next(null, member, subject, user);
				});
			});
		},
		function(member, subject, user, next) {
			var aclRules;

			if (memberData.role === 'creator') {
				// Is allowed to read and update the subject. Also to create/read/update/delete tasks, levels, members, evaluations, and comments.
				aclRules = [ {
					roles: [user.username],
					allows: [
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug, permissions: ['GET', 'PUT']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member', permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/evaluations', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/evaluations/:evaluation', permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/comments', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/comments/:comment', permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task',  permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task/levels', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task/levels/:level', permissions: ['GET', 'PUT', 'DELETE']},
					]
				} ];
			} else if (memberData.role === 'assistant') {
				// Is allowed to read the subject. Also to create/read/update/delete tasks, levels, members, evaluations, and comments.
				aclRules = [ {
					roles: [user.username],
					allows: [
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug, permissions: ['GET']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member', permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/evaluations', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/evaluations/:evaluation', permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/comments', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/members/:member/comments/:comment', permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task',  permissions: ['GET', 'PUT', 'DELETE']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task/levels', permissions: ['GET', 'POST']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task/levels/:level', permissions: ['GET', 'PUT', 'DELETE']},
					]
				} ];
			} else {
				// Is allowed to read the subject and its tasks and levels.
				aclRules = [ {
					roles: [user.username],
					allows: [
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug, permissions: ['GET']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks', permissions: ['GET']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task', permissions: ['GET']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task/levels', permissions: ['GET']},
						{resources: 'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task/levels/:level', permissions: ['GET']},
					]
				} ];
			}

			acl.allow(aclRules, function(err) {
				if (err) {
					return next(err);
				}

				next(null, member);
			});
		}
	], callback);
};

/**
 * Update the member with given memberData.
 *
 * @param callback
 * @param authUser
 * @param subject
 * @param memberId
 * @param memberData
 */
exports.update = function(callback, authUser, subject, memberId, memberData) {
	async.waterfall([
		function(next) {
			exports.read(next, authUser, subject, memberId);
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
 * @param authUser
 * @param subject
 * @param memberId
 */
exports.delete = function(callback, authUser, subject, memberId) {
	async.waterfall([
		function(next) {
			exports.read(next, authUser, subject, memberId);
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
