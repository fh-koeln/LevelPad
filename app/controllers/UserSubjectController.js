
var Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors'),
	acl = require('../../config/acl');

/**
 * List all subjects by user and apply an optional filter.
 *
 * @param callback
 * @param user
 */
exports.list = function(callback, user) {
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

			Member.find({ user: user._id }).populate('subject').exec(next);
		}
	], callback);

};
