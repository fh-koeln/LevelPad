
var User = require('../models/User'),
	async = require('async'),
	acl = require('../../config/acl');

/**
 * Get all users and apply optional filter.
 */
exports.getAll = function(callback, filter) {
	User.find(filter, callback);
};

/**
 * Find user by username.
 *
 * @param callback
 * @param username
 */
exports.getUser = function(callback, username) {
	// TODO assert here that username is a string?
	User.findOne({ username: username }, function(err, user) {
		if (!err && !user) {
			err = new Error('Unknown user');
		}
		callback(err, user);
	});
};

/**
 * Create a new user based on the given username.
 *
 * @param callback
 * @param userdata
 */
exports.create = function(callback, userdata) {
	var user = new User(userdata);

	// TODO not every user should be an admin, or?
	user.role = 'administrator';

	async.waterfall([
		function(next) {
			user.save(next);
		},
		function(user, numberAffected, next) {
			acl.setRole(user.username, user.role, function(err) {
				next(err, user); // keep user result from mongoose
			});
		}
	], callback);
};

/**
 * Update the user with given username. The userdata are optional
 * and the username ifself could not changed (currently).
 *
 * @param callback
 * @param username
 * @param userdata
 */
exports.update = function(callback, username, userdata) {
	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	async.waterfall([
		function(next) {
			exports.getUser(next, username);
		},
		function(user, next) {
			if (userdata.firstname !== undefined) {
				user.firstname = userdata.firstname;
			}
			if (userdata.lastname !== undefined) {
				user.lastname = userdata.lastname;
			}
			if (userdata.email !== undefined) {
				user.email = userdata.email;
			}
			if (userdata.studentNumber !== undefined) {
				user.studentNumber = userdata.studentNumber;
			}
			user.save(next);
		}
	], callback);
};

/**
 * Removes the user with the given username.
 *
 * @param callback
 * @param username
 */
exports.delete = function(callback, username) {
	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	// currently replaced because findOneAndRemove will not throw an error if the user doesn't exist anymore.
//	User.findOneAndRemove({ username: username }, callback);

	async.waterfall([
		function(next) {
			exports.getUser(next, username);
		},
		function(user, next) {
			user.remove(next);
		}
	], callback);
};
