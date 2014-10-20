'use strict';

var UserController = require('../../controllers/UserController'),
	User = require('../../models/User'),
	assert = require('chai').assert,
	expect = require('chai').expect,
	should = require('should'),
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
				assert.lengthOf(users, 4, 'Users array has length of 2');
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
				expect(user).property('firstname', 'Max');
				expect(user).property('lastname', 'Mustermann');
				expect(user).property('email', 'max.mustermann@fh-koeln.de');
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
				expect(user).property('firstname', 'Max');
				expect(user).property('lastname', 'Mustermann');
				expect(user).property('email', 'max.mustermann@fh-koeln.de');
				expect(user).property('role', 'administrator');

				done();
			}, 'admin1');
		});

		it('should fail for an unknown user (unknownuser)', function(done) {
			UserController.read(function(err, user) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(user, 'User should be null');

				expect(err).property('name', 'NotFoundError');
				expect(err).property('message', 'Not Found: "User"');
				expect(err).property('entity_name', 'User');

				done();
			}, 'unknownuser');
		});
	});

	describe('create', function() {
		it('should save a new user (admin2) with full data', function(done) {
			var userdata = {
				username: 'Admin2',
				firstname: 'Peter',
				lastname: 'Mustermann',
				email: 'peter.mustermann@fh-koeln.de'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'admin2' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNull(user, 'User should be not null');
						next(err, user);
					});
				},
				function(next) {
					UserController.create(function (err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin2'); // automatically transformed to lowercase
						expect(user).property('firstname', 'Peter');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'peter.mustermann@fh-koeln.de');
						expect(user).property('role', 'administrator'); // @todo: This will fail if default role will be switched to student

						next(err, user);
					}, userdata);
				},
				function(next) {
					User.findOne({ username: userdata.username.toLowerCase() }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin2'); // automatically transformed to lowercase
						expect(user).property('firstname', 'Peter');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'peter.mustermann@fh-koeln.de');
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
				firstname: 'Anna',
				lastname: 'Mustermann',
				email: 'anna.mustermann@fh-koeln.de'
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
				firstname: 'Max',
				lastname: 'Mustermann',
				email: 'max.mustermann@fh-koeln.de'
			};
			UserController.create(function(err, user) {
				should.exist(err);
				should.not.exist(user);

				err.should.have.property('name').and.be.equal('AlreadyInUseError');

				done();
			}, userdata);
		});

		it('should fail for an already known email (student1)', function(done) {
			var userdata = {
				username: 'student1',
				firstname: 'Manuel',
				lastname: 'Manoli',
				email: 'max.mustermann@fh-koeln.de'
			};
			UserController.create(function(err, user) {
				should.exist(err);
				should.not.exist(user);

				err.should.have.property('name').and.be.equal('AlreadyInUseError');
				err.should.have.property('arg1').and.be.equal('email');

				done();
			}, userdata);
		});

		it('should fail for an already known studentNumber (student1)', function(done) {
			var userdata = {
				username: 'student1',
				firstname: 'Manuel',
				lastname: 'Manoli',
				studentNumber: '11111111'
			};
			UserController.create(function(err, user) {
				should.exist(err);
				should.not.exist(user);

				err.should.have.property('name').and.be.equal('AlreadyInUseError');
				err.should.have.property('arg1').and.be.equal('studentNumber');

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
				firstname: 'Maximilan'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Max');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'max.mustermann@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Maximilan');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'max.mustermann@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					}, 'admin1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Maximilan');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'max.mustermann@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				}
			], done);
		});

		it('should not update a known user (student1) with already used studentNumber', function(done) {
			var newuserdata = {
				studentNumber: '12345678'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'student1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'student1');
						expect(user).property('firstname', 'Manuel');
						expect(user).property('lastname', 'Manoli');
						expect(user).property('email', 'manuel.manoli@fh-koeln.de');
						expect(user).property('role', 'student');
						expect(user).property('studentNumber', '11111111');

						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNotNull(err, 'Error should be not null');
						assert.isUndefined(user, 'User should be undefined');

						next(null);
					}, 'student1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'student1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'student1');
						expect(user).property('firstname', 'Manuel');
						expect(user).property('lastname', 'Manoli');
						expect(user).property('email', 'manuel.manoli@fh-koeln.de');
						expect(user).property('role', 'student');
						expect(user).property('studentNumber', '11111111');

						next(err);
					});
				}
			], done);
		});

		it('should not update a known user (student1) with already used email', function(done) {
			var newuserdata = {
				email: 'laura.mueller@fh-koeln.de'
			};
			async.series([
				function(next) {
					User.findOne({ username: 'student1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be null');

						expect(user).property('username', 'student1');
						expect(user).property('firstname', 'Manuel');
						expect(user).property('lastname', 'Manoli');
						expect(user).property('email', 'manuel.manoli@fh-koeln.de');
						expect(user).property('role', 'student');
						expect(user).property('studentNumber', '11111111');

						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNotNull(err, 'Error should be not null');
						assert.isUndefined(user, 'User should be undefined');

						next(null);
					}, 'student1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'student1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'student1');
						expect(user).property('firstname', 'Manuel');
						expect(user).property('lastname', 'Manoli');
						expect(user).property('email', 'manuel.manoli@fh-koeln.de');
						expect(user).property('role', 'student');
						expect(user).property('studentNumber', '11111111');

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
						expect(user).property('firstname', 'Max');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'max.mustermann@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					});
				},
				function(next) {
					UserController.update(function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Max');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'max.mustermann@fh-koeln.de');
						expect(user).property('role', 'administrator');

						next(err);
					}, 'admin1', newuserdata);
				},
				function(next) {
					User.findOne({ username: 'admin1' }, function(err, user) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(user, 'User should be not null');

						expect(user).property('username', 'admin1');
						expect(user).property('firstname', 'Max');
						expect(user).property('lastname', 'Mustermann');
						expect(user).property('email', 'max.mustermann@fh-koeln.de');
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
