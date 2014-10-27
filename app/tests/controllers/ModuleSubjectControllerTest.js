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
			ModuleSubjectController.read(function(err, moduleSubject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(moduleSubject, 'Subject should be not null');

				expect(moduleSubject).property('slug', subjects.wba1Wise1415.slug);
				expect(moduleSubject).property('module');
				expect(moduleSubject).property('semester',subjects.wba1Wise1415.semester);
				expect(moduleSubject).property('status', subjects.wba1Wise1415.status);

				var module = moduleSubject.module;
				expect(module).property('shortName', subjects.wba1Wise1415.module.shortName);
				expect(module).property('name', subjects.wba1Wise1415.module.name);

				done();
			}, subjects.wba1Wise1415.module.slug, subjects.wba1Wise1415.year, subjects.wba1Wise1415.semester);
		});

		it('should return a known subject (WBA 2 2014 Sommersemester) via module', function(done) {
			async.waterfall([
				function(next) {
					Module.findOne({ slug: subjects.wba2Sose14.module.slug }, next);
				},
				function(module, next) {
					assert.isNotNull(module, 'Module should be not null');

					ModuleSubjectController.read(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', subjects.wba2Sose14.slug);
						expect(subject).property('module');
						expect(subject).property('semester', subjects.wba2Sose14.semester);
						expect(subject).property('status', subjects.wba2Sose14.status);

						var module = subject.module;
						expect(module).property('shortName', subjects.wba2Sose14.module.shortName);
						expect(module).property('name', subjects.wba2Sose14.module.name);

						next();
					}, module, subjects.wba2Sose14.year, subjects.wba2Sose14.semester);
				}
			], done);
		});

		it('should fail for an unknown module (unknownmodule) via string', function(done) {
			ModuleSubjectController.read(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, 'unknownmodule', 2014, 'Wintersemester');
		});
	});

	describe('create', function() {
		it('should save a new subject (WBA 1 2013 Wintersemester) with full data', function(done) {
			var subjectdata = {
				status: 'active'
			};
			async.series([
				function(next) {
					Subject.findOne({ slug: 'wise1314', year: 2013, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNull(subject, 'Subject should be null');
						next(err, subject);
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
					}, 'wba1', 2013, 'Wintersemester', subjectdata);
				},
				function(next) {
					Subject.findOne({ slug: 'wise1314', year: 2013, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
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
					});
				}
			], done);
		});

		it('should fail if subject has missing attributes', function(done) {
			var subjectdata = {};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'ValidationError');
				expect(err).property('message', 'Validation failed');

				expect(err).property('errors');
				expect(err.errors).property('status');

				done();
			}, 'wba1', 2012, 'Wintersemester', subjectdata);
		});

		it('should fail for an already existing subject (WBA 1 2014 Wintersemester)', function(done) {
			var subjectdata = {
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'AlreadyInUseError');

				done();
			}, 'wba1', 2014, 'Wintersemester', subjectdata);
		});
	});

	describe('update', function() {
		it('should successfully update a known subject (WBA 1 2014 Wintersemester) without data', function(done) {
			var newsubjectdata = {};
			async.series([
				function(next) {
					Subject.findOne({ slug: 'wise1415', year: 2014, semester: 'Wintersemester' }, function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');
						next(err);
					});
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');
						next(err);
					}, 'wba1', 2014, 'Wintersemester', newsubjectdata);
				},
				function(next) {
					Subject.findOne({ slug: 'wise1415', year: 2014, semester: 'Wintersemester' }, function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');
						next(err);
					});
				}
			], done);
		});

		it('should successfully update a known subject (WBA 1 2014 Wintersemester) with data', function(done) {
			var newsubjectdata = {
				status: 'inactive'
			};
			async.series([
				function(next) {
					Subject.findOne({ slug: 'wise1415', year: 2014, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('slug', subjects.wba1Wise1415.slug);
						expect(subject).property('module');
						expect(subject).property('semester', subjects.wba1Wise1415.semester);
						expect(subject).property('status', subjects.wba1Wise1415.status);

						var module = subject.module;
						expect(module).property('shortName', subjects.wba1Wise1415.module.shortName);
						expect(module).property('name', subjects.wba1Wise1415.module.name);

						next(err);
					});
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
					}, 'wba1', 2014, 'Wintersemester', newsubjectdata);
				},
				function(next) {
					Subject.findOne({ slug: 'wise1415', year: 2014, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
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
					});
				}
			], done);
		});

		it('should not update the slug (wba1)', function(done) {
			var newmoduledata = {
				slug: 'change'
			};
			async.series([
				function(next) {
					Subject.findOne({ slug: 'wise1415', year: 2014, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
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
					});
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
					}, 'wba1', 2014, 'Wintersemester', newmoduledata);
				},
				function(next) {
					Subject.findOne({ slug: 'wise1415', year: 2014, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
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
					});
				}
			], done);
		});

		it('should fail for an unknown module (unknownmodule)', function(done) {
			var moduledata = {};
			ModuleSubjectController.update(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, 'unknownmodule', moduledata);
		});
	});

	describe('delete', function() {
		it('should successfully remove a known subject (wba1 2014 Wintersemester)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');
				done(err);
			}, 'wba1', 2014, 'Wintersemester');
		});

		it('should fail for an unknown subject (unknownmodule)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'NotFoundError');

				done();
			}, 'unknownmodule', 2014, 'Sommersemester');
		});

		it('should fail for an unknown year or semester', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null');

				expect(err).property('name', 'NotFoundError');

				done();
			}, 'wba1', 2014, 'unknownsemester');
		});
	});

});
