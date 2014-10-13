
var User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors'),
	acl = require('../../config/acl');

/**
 * List all users and apply optional filter.
 *
 * @param callback
 * @param filter
 */
exports.list = function(callback, filter) {
	User.find(filter, callback);
};

/**
 * Find user by username.
 *
 * @param callback
 * @param username
 */
exports.read = function(callback, username) {
	// TODO assert here that username is a string?
	User.findOne({ username: username }, function(err, user) {
		if (!err && !user) {
			//err = new Error('Unknown user');
			err = new errors.NotFoundError('User');
		}
		callback(err, user);
	});
};

/**
 * Create a new user based on the given userdata.
 *
 * @param callback
 * @param userdata
 */
exports.create = function(callback, userdata) {
	var user = new User(userdata);

	// TODO Change to 'student'
	user.role = 'administrator';

	async.waterfall([
		function(next) {
			user.save(next);
		}
	], callback);
};

/**
 * Update the user with given username. Userdata properties are optional
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
			exports.read(next, username);
		},
		function(user, next) {
			if (userdata.studentNumber !== undefined) {
				user.studentNumber = userdata.studentNumber;
			}
			if (userdata.firstname !== undefined) {
				user.firstname = userdata.firstname;
			}
			if (userdata.lastname !== undefined) {
				user.lastname = userdata.lastname;
			}
			if (userdata.email !== undefined) {
				user.email = userdata.email;
				User.findOne({ email: userdata.email }, function(err, user) {
					if (!err && user && user.username !== username) {
						err = new errors.AlreadyInUseError('User', 'email');
					}
					next(err, user);
				});
			} else {
				next(null, user);
			}
		},
		function(user, next) {
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
			exports.read(next, username);
		},
		function(user, next) {
			user.remove(next);
		}
	], callback);
};
