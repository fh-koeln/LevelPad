'use strict';

var Member = require('../models/Member'),
	User = require('../models/User'),
	Module = require('../models/Module'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all subjects by user and apply an optional filter.
 *
 * @param callback
 * @param authUser
 * @param user
 */
exports.list = function(callback, authUser, user) {
	async.waterfall([
		function(next) {
			if (typeof user === 'string') {
				User.findByUsername(user, next);
			} else {
				next(null, user);
			}
		},
		function(user, next) {
			if (!user || !user._id) {
				return next(new errors.NotFoundError('User'));
			}

			Member.find({ user: user._id }).select('-user').populate('subject', '-registrationPassword -tasks').exec(function(err, memberWithSubject) {
				Module.populate(memberWithSubject, {
					path: 'subject.module',
				}, function(err, memberWithSubjectAndModule) {
					if (err) {
						return next(err);
					}

					next(null, memberWithSubjectAndModule);
				});
			});
		}
	], callback);
};
