'use strict';

var User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all users and apply optional filter.
 *
 * @param callback
 * @param authUser
 * @param filter
 */
exports.list = function(callback, authUser, filter) {
	User.find(filter, callback);
};

/**
 * Find user by username.
 *
 * @param callback
 * @param authUser
 * @param username
 */
exports.read = function(callback, authUser, username) {
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
 * @param authUser
 * @param userdata
 */
exports.create = function(callback, authUser, userdata) {
	var user = new User(userdata);

	async.waterfall([
		function(next) {
			User.find({}).limit(1).exec(function(err, existingUsers) {
				if (err) {
					next(err);
				} else if (existingUsers.length > 0) {
					user.role = 'student';
					next(null);
				} else {
					user.role = 'administrator';
					next(null);
				}
			});
		},
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
 * @param authUser
 * @param username
 * @param userdata
 */
exports.update = function(callback, authUser, username, userdata) {
	async.waterfall([
		function(next) {
			exports.read(next, authUser, username);
		},
		function(user, next) {
			if (userdata.firstname !== undefined) {
				user.firstname = userdata.firstname;
			}
			if (userdata.lastname !== undefined) {
				user.lastname = userdata.lastname;
			}
			if (userdata.role !== undefined) {
				user.role = userdata.role;
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
 * @param authUser
 * @param username
 */
exports.delete = function(callback, authUser, username) {
	async.waterfall([
		function(next) {
			exports.read(next, authUser, username);
		},
		function(user, next) {
			user.remove(next);
		}
	], callback);
};
