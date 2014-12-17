'use strict';

var Subject = require('../models/Subject'),
	async = require('async');

/**
 * List all subjects and apply an optional filter.
 *
 * @param callback
 * @param authUser
 * @param filter
 */
exports.list = function(callback, authUser, filter) {
	async.waterfall([
		function(next) {

			filter = filter || {};

			Subject.find(filter).select('-registrationPassword -tasks').populate('module').exec(next);
		}
	], callback);

};
