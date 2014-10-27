'use strict';

var ModuleSubjectController = require('../../controllers/ModuleSubjectController'),
	Subject = require('../../models/Subject'),
	Module = require('../../models/Module'),
	assert = require('chai').assert,
	expect = require('chai').expect,
	db = require('../db'),
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
			}, subjects.wba1Wise1415.module.slug);
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
					}, module);
				}
			], done);
		});
	});

	describe('read', function() {
		it('should return a known subject (wba1 2014 Wintersemester) via string', function(done) {
			ModuleSubjectController.read(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');

				expect(subject).property('slug', subjects.wba1Wise1415.slug);
				expect(subject).property('module');
				expect(subject).property('semester',subjects.wba1Wise1415.semester);
				expect(subject).property('year', 2014);
				expect(subject).property('status', subjects.wba1Wise1415.status);

				var module = subject.module;
				expect(module).property('shortName', subjects.wba1Wise1415.module.shortName);
				expect(module).property('name', subjects.wba1Wise1415.module.name);

				done();
			}, subjects.wba1Wise1415.module.slug, subjects.wba1Wise1415.slug);
		});

		it('should return a known subject (wba1 2014 Sommersemester) via module', function(done) {
			async.waterfall([
				function(next) {
					Module.findOne({ slug: 'wba1' }, next);
				},
				function(module, next) {
					assert.isNotNull(module, 'Module should be not null');

					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'wise1415');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('year', 2014);
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next();
					}, module, 'wise1415');
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
				status: 'active',
			};
			async.series([
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
					}, 'wba1', subjectData);
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
					}, 'wba1', 'wise1314');
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
			}, 'wba1', subjectData);
		});

		it('should fail for an already existing subject (WBA 1 2014 Wintersemester)', function(done) {
			var subjectData = {
				year: 2014,
				semester: 'Wintersemester'
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'AlreadyInUseError');

				done();
			}, 'wba1', subjectData);
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
					}, 'wba1', 'wise1415');
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');
						next(err);
					}, 'wba1', 'wise1415', newSubjectData);
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
					}, 'wba1', 'wise1415');
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', 'wise1415');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('status', 'inactive');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Web-basierte Anwendungen 1');

						next(err);
					}, 'wba1', 'wise1415', newSubjectData);
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
					}, 'wba1', 'wise1415');
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
					}, 'wba1', 'wise1415', newSubjectData);
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
			}, 'unknownmodule', newSubjectData);
		});
	});

	describe('delete', function() {
		it('should successfully remove a known subject (wba1 2014 Wintersemester)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');
				done(err);
			}, 'wba1', 'wise1415');
		});

		it('should fail for an unknown subject (unknownmodule)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'NotFoundError');

				done();
			}, 'unknownmodule', 'wise1415');
		});

		it('should fail for an unknown subject', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null');

				expect(err).property('name', 'NotFoundError');

				done();
			}, 'wba1', 'wise1516');
		});
	});

});
