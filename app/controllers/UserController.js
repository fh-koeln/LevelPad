'use strict';

var User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors');

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

	user.role = 'student';

	async.waterfall([
		function(next) {
			if (userdata.email !== undefined) {
				user.email = userdata.email;
				User.findOne({ email: userdata.email }, function(err, duplicateUser) {
					if (err) {
						next(err);
					} else if (duplicateUser) {
						next(new errors.AlreadyInUseError('User', 'email'));
					} else {
						next(null, user);
					}
				});
			} else {
				next(null, user);
			}
		},
		function(user, next) {
			if (userdata.studentNumber !== undefined) {
				user.studentNumber = userdata.studentNumber;
				User.findOne({ studentNumber: userdata.studentNumber }, function(err, duplicateUser) {
					if (err) {
						next(err);
					} else if (duplicateUser) {
						next(new errors.AlreadyInUseError('User', 'studentNumber'));
					} else {
						next(null, user);
					}
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
 * Update the user with given username. Userdata properties are optional
 * and the username ifself could not changed (currently).
 *
 * @param callback
 * @param username
 * @param userdata
 */
exports.update = function(callback, username, userdata) {
	async.waterfall([
		function(next) {
			exports.read(next, username);
		},
		function(user, next) {
			if (userdata.firstname !== undefined) {
				user.firstname = userdata.firstname;
			}
			if (userdata.lastname !== undefined) {
				user.lastname = userdata.lastname;
			}
			next(null, user);
		},
		function(user, next) {
			if (userdata.email !== undefined) {
				user.email = userdata.email;
				User.findOne({ email: userdata.email }, function(err, duplicateUser) {
					if (err) {
						next(err);
					} else if (duplicateUser && duplicateUser.username !== username) {
						next(new errors.AlreadyInUseError('User', 'email'));
					} else {
						next(null, user);
					}
				});
			} else {
				next(null, user);
			}
		},
		function(user, next) {
			if (userdata.studentNumber !== undefined) {
				user.studentNumber = userdata.studentNumber;
				User.findOne({ studentNumber: userdata.studentNumber }, function(err, duplicateUser) {
					if (err) {
						next(err);
					} else if (duplicateUser && duplicateUser.username !== username) {
						next(new errors.AlreadyInUseError('User', 'studentNumber'));
					} else {
						next(null, user);
					}
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
	async.waterfall([
		function(next) {
			exports.read(next, username);
		},
		function(user, next) {
			user.remove(next);
		}
	], callback);
};
