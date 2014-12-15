'use strict';

var ModuleSubjectController = require('../../controllers/ModuleSubjectController'),
	Module = require('../../models/Module'),
	User = require('../../models/User'),
	assert = require('chai').assert,
	expect = require('chai').expect,
	db = require('../db'),
	users = require('../users'),
	subjects = require('../subjects'),
	async = require('async');

describe('ModuleSubjectController', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData
		], done);
	});

	describe('list', function() {
		it('should find all subjects for module (wba1) via string', function(done) {
			ModuleSubjectController.list(function(err, moduleSubjects) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(moduleSubjects, 'Subjects should be not null');
				assert.lengthOf(moduleSubjects, 1, 'Subjects array has length of 1');
				done(err);
			}, users.admin1, subjects.wba1Wise1415.module.slug);
		});

		it('should find all subjects for module (wba1) via module', function(done) {
			async.waterfall([
				function(next) {
					Module.findOne({ slug: subjects.wba1Wise1415.module.slug }, next);
				},
				function(module, next) {
					assert.isNotNull(module, 'Module should be not null');

					ModuleSubjectController.list(function(err, moduleSubjects) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(moduleSubjects, 'Subjects should be not null');
						assert.lengthOf(moduleSubjects, 1, 'Subjects array has length of 1');
						next(err);
					}, users.admin1, module);
				}
			], done);
		});

		it('should fail for an unknown module via broken object', function(done) {
			ModuleSubjectController.list(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, users.admin1, {});
		});
	});

	describe('read', function() {
		it('should return a known subject (wba1 2014 Wintersemester) via string', function(done) {
			ModuleSubjectController.read(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');

				expect(subject).property('slug', subjects.wba1Wise1415.slug);
				expect(subject).property('module');
				expect(subject).property('semester', subjects.wba1Wise1415.semester);
				expect(subject).property('year', subjects.wba1Wise1415.year);
				expect(subject).property('status', subjects.wba1Wise1415.status);

				var module = subject.module;
				expect(module).property('shortName', subjects.wba1Wise1415.module.shortName);
				expect(module).property('name', subjects.wba1Wise1415.module.name);

				done();
			}, users.admin1, subjects.wba1Wise1415.module.slug, subjects.wba1Wise1415.slug);
		});

		it('should return a known subject (WBA 2 2014 Sommersemester) via module', function(done) {
			async.waterfall([
				function(next) {
					Module.findOne({ slug: subjects.wba2Sose14.module.slug }, next);
				},
				function(module, next) {
					assert.isNotNull(module, 'Module should not be null');

					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should not be null');

						expect(subject).property('slug', subjects.wba2Sose14.slug);
						expect(subject).property('module');

						expect(subject).property('year', subjects.wba2Sose14.year);
						expect(subject).property('semester', subjects.wba2Sose14.semester);
						expect(subject).property('status', subjects.wba2Sose14.status);

						var module = subject.module;
						expect(module).property('shortName', subjects.wba2Sose14.module.shortName);
						expect(module).property('name', subjects.wba2Sose14.module.name);

						next();
					}, users.admin1, module, subjects.wba2Sose14.slug);
				}
			], done);
		});

		it('should fail for an unknown module (unknownmodule) via string', function(done) {
			ModuleSubjectController.read(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, 'unknownmodule', 'wise1415');
		});
	});

	describe('create', function() {
		it('should save a new subject (WBA 1 2013 Wintersemester) with full data', function(done) {
			var subjectData = {
				year: 2013,
				semester: 'Wintersemester',
				status: 'active'
			};
			async.series([
				function(next) {
					User.findOne({ username: users.lecturer1.username }, function(err, user) {
						if (err) {
							return next(err);
						}

						subjectData.creator = user._id;
						next();
					});
				},
				function(next) {
					ModuleSubjectController.create(function (err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'wise1314');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next(err, subject);
					}, users.admin1, 'wba1', subjectData);
				},
				function(next) {
					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'wise1314');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next(err, subject);
					}, users.admin1, 'wba1', 'wise1314');
				}
			], done);
		});

		it('should save a new subject (WBA 1 2016 Sommersemester) with password', function(done) {
			var subjectData = {
				year: 2016,
				semester: 'Sommersemester',
				status: 'active',
				registrationActive: true,
				registrationPassword: 'testpassword'
			};
			async.series([
				function(next) {
					User.findOne({ username: users.lecturer1.username }, function(err, user) {
						if (err) {
							return next(err);
						}

						subjectData.creator = user._id;
						next();
					});
				},
				function(next) {
					ModuleSubjectController.create(function (err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'sose16');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');
						expect(subject).property('registrationActive', true);
						expect(subject).property('registrationPassword', 'testpassword');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next(err, subject);
					}, users.admin1, 'wba1', subjectData);
				},
				function(next) {
					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'sose16');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');
						expect(subject).property('registrationActive', true);
						expect(subject).property('registrationPassword', 'testpassword');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next(err, subject);
					}, users.admin1, 'wba1', 'sose16');
				}
			], done);
		});

		it('should fail if subject has missing attributes', function(done) {
			var subjectData = {
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'ArgumentNullError');

				done();
			}, users.admin1, 'wba1', subjectData);
		});

		it('should fail if subject has missing creator attribute', function(done) {
			var subjectData = {
				year: 2014,
				semester: 'Wintersemester'
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'ArgumentNullError');

				done();
			}, users.admin1, 'wba1', subjectData);
		});

		it('should fail for an broken module object', function(done) {
			var subjectData = {
				year: 2014,
				semester: 'Wintersemester',
				creator: '234567890'
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'NotFoundError');

				done();
			}, users.admin1, {}, subjectData);
		});

		it('should fail for an already existing subject (WBA 1 2014 Wintersemester)', function(done) {
			var subjectData = {
				year: 2014,
				semester: 'Wintersemester',
				creator: '234567890'
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'AlreadyInUseError');

				done();
			}, users.admin1, 'wba1', subjectData);
		});
	});

	describe('update', function() {
		it('should successfully update a known subject (WBA 1 2014 Wintersemester) without data', function(done) {
			var newSubjectData = {
			};
			async.series([
				function(next) {
					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should not be null');

						next(err);
					}, users.admin1, 'wba1', 'wise1415');
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');
						next(err);
					}, users.admin1, 'wba1', 'wise1415', newSubjectData);
				}
			], done);
		});

		it('should successfully update a known subject (WBA 1 2014 Wintersemester) with data', function(done) {
			var newSubjectData = {
				status: 'inactive'
			};
			async.series([
				function(next) {
					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should not be null');

						next(err);
					}, users.admin1, 'wba1', 'wise1415');
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', subjects.wba1Wise1415.slug);
						expect(subject).property('module');
						expect(subject).property('semester', subjects.wba1Wise1415.semester);
						expect(subject).property('status', 'inactive');

						var module = subject.module;
						expect(module).property('shortName', subjects.wba1Wise1415.module.shortName);
						expect(module).property('name', subjects.wba1Wise1415.module.name);

						next(err);
					}, users.admin1, 'wba1', 'wise1415', newSubjectData);
				}
			], done);
		});

		it('should not update the slug (wba1)', function(done) {
			var newSubjectData = {
				slug: 'change'
			};
			async.series([
				function(next) {
					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should not be null');

						next(err);
					}, users.admin1, 'wba1', 'wise1415');
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'wise1415');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next(err);
					}, users.admin1, 'wba1', 'wise1415', newSubjectData);
				}
			], done);
		});

		it('should fail for an unknown module (unknownmodule)', function(done) {
			var newSubjectData = {
			};
			ModuleSubjectController.update(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, users.admin1, 'unknownmodule', newSubjectData);
		});
	});

	describe('delete', function() {
		it('should successfully remove a known subject (wba1 2014 Wintersemester)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');
				done(err);
			}, users.admin1, 'wba1', 'wise1415');
		});

		it('should fail for an unknown subject (unknownmodule)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'NotFoundError');

				done();
			}, users.admin1, 'unknownmodule', 'wise1415');
		});

		it('should fail for an unknown subject', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null');

				expect(err).property('name', 'NotFoundError');

				done();
			}, users.admin1, 'wba1', 'wise1516');
		});
	});

});
