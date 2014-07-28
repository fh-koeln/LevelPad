'use strict';

var UserController = require('../../controllers/UserController'),
	User = require('../../models/User'),
	assert = require('chai').assert,
	expect = require('chai').expect,
//	sinon = require('sinon'),
	db = require('../db'),
	async = require('async');

describe('UserController', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData
		], done);
	});

	describe('list', function() {
		it('should find all users without filter (default)', function(done) {
			UserController.list(function(err, users) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(users, 'Users should be not null');
				assert.lengthOf(users, 2, 'Users array has length of 2');
				done();
			});
		});

		it('should find an user (admin1 by username) via filter', function(done) {
			var filter = { username: 'admin1' };
			UserController.list(function(err, users) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(users, 'Users should be not null');
				assert.lengthOf(users, 1, 'Users array has length of 1');

				var user = users[0];
				expect(user).property('username', 'admin1');
				expect(user).property('firstname', 'Admin1');
				expect(user).property('lastname', 'Admin1');
				expect(user).property('email', 'admin1@fh-koeln.de');
				expect(user).property('role', 'administrator');

				done();
			}, filter);
		});
	});

	describe('read', function() {
		it('should return a known user (admin1)', function(done) {
			UserController.read(function(err, user) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(user, 'User should be not null');

				expect(user).property('username', 'admin1');
				expect(user).property('firstname', 'Admin1');
				expect(user).property('lastname', 'Admin1');
				expect(user).property('email', 'admin1@fh-koeln.de');
				expect(user).property('role', 'administrator');

				done();
			}, 'admin1');
		});

		it('should fail for an unknown user (unknownuser)', function(done) {
			UserController.read(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(user, 'User should be null');

				expect(err).property('name', 'Error');
				expect(err).property('message', 'Unknown user');

				done();
			}, 'unknownuser');
		});
	});

	describe('create', function() {
		it('should save a new user (NewTestUser1) with full data', function(done) {
			var userdata = {
				username: 'NewTestUser1',
				firstname: 'NewTestUser1',
				lastname: 'NewTestUser1',
				email: 'NewTestUser1@fh-koeln.de'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'NewTestUser1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNull(user, 'User should be not null');
						next(err, user);
					});
				},
				function(next) {
					UserController.create(function (err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'newtestuser1'); // automatically transformed to lowercase
						expect(user).property('firstname', 'NewTestUser1');
						expect(user).property('lastname', 'NewTestUser1');
						expect(user).property('email', 'NewTestUser1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err, user);
					}, userdata);
				},
				function(next) {
					User.findOne({ username: userdata.username.toLowerCase() }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'newtestuser1'); // automatically transformed to lowercase
						expect(user).property('firstname', 'NewTestUser1');
						expect(user).property('lastname', 'NewTestUser1');
						expect(user).property('email', 'NewTestUser1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err, user);
					});
				}
			], done);
		});

		it('should fail if user has no firstname and lastname', function(done) {
			var userdata = {
				username: 'NewTestUser2'
			};
			UserController.create(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(user, 'User should be null or undefined');

				expect(err).property('name', 'ValidationError');
				expect(err).property('message', 'Validation failed');

				expect(err).property('errors');
				expect(err.errors).property('firstname');
				expect(err.errors).property('lastname');

				done();
			}, userdata);
		});

		it('should fail if user has no username', function(done) {
			var userdata = {
				firstname: 'NewTestUser3',
				lastname: 'NewTestUser3',
				email: 'NewTestUser1@fh-koeln.de'
			};
			UserController.create(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(user, 'User should be null or undefined');

				expect(err).property('name', 'ValidationError');
				expect(err).property('message', 'Validation failed');

				expect(err).property('errors');
				expect(err.errors).property('username');

				done();
			}, userdata);
		});

		it('should fail for an already known user (admin1)', function(done) {
			var userdata = {
				username: 'admin1',
				firstname: 'NewTestUser3',
				lastname: 'NewTestUser3',
				email: 'NewTestUser1@fh-koeln.de'
			};
			UserController.create(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(user, 'User should be null or undefined');

				expect(err).property('name', 'MongoError');
				expect(err).property('code', 11000);

				assert.property(err, 'err');
				assert.include(err.err, 'duplicate key error');

				done();
			}, userdata);
		});
	});

	describe('update', function() {
		it('should successfully update a known user (admin1) without data', function(done) {
			var newuserdata = {};
			async.series([
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');
						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');
						next(err);
					}, 'admin1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');
						next(err);
					});
				}
			], done);
		});

		it('should successfully update a known user (admin1) with data', function(done) {
			var newuserdata = {
				firstname: 'New firstname',
				lastname: 'New lastname'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Admin1');
						expect(user).property('lastname', 'Admin1');
						expect(user).property('email', 'admin1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'New firstname');
						expect(user).property('lastname', 'New lastname');
						expect(user).property('email', 'admin1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					}, 'admin1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'New firstname');
						expect(user).property('lastname', 'New lastname');
						expect(user).property('email', 'admin1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				}
			], done);
		});

		it('should not update the username (admin1)', function(done) {
			var newuserdata = {
				username: 'newusername'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Admin1');
						expect(user).property('lastname', 'Admin1');
						expect(user).property('email', 'admin1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Admin1');
						expect(user).property('lastname', 'Admin1');
						expect(user).property('email', 'admin1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					}, 'admin1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Admin1');
						expect(user).property('lastname', 'Admin1');
						expect(user).property('email', 'admin1@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				}
			], done);
		});

		it('should fail for an unknown user (unknownuser)', function(done) {
			var userdata = {};
			UserController.update(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(user, 'User should be null');
				done();
			}, 'unknownuser', userdata);
		});
	});

	describe('delete', function() {
		it('should successfully remove a known user (admin1)', function(done) {
			UserController.delete(function(err, user) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(user, 'User should be not null');
				done();
			}, 'admin1');
		});

		it('should fail for an unknown user (unknownuser)', function(done) {
			UserController.delete(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(user, 'User should be null');
				done();
			}, 'unknownuser');
		});
	});

});
