'use strict';

var ModuleSubjectController = require('../../controllers/ModuleSubjectController'),
	Subject = require('../../models/Subject'),
	Module = require('../../models/Module'),
	assert = require('chai').assert,
	expect = require('chai').expect,
//	sinon = require('sinon'),
	db = require('../db'),
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
			ModuleSubjectController.list(function(err, subjects) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subjects, 'Subjects should be not null');
				assert.lengthOf(subjects, 1, 'Subjects array has length of 1');
				done(err);
			}, 'wba1');
		});

		it('should find all subjects for module (wba1) via module', function(done) {
			async.waterfall([
				function(next) {
					Module.findOne({ slug: 'wba1' }, next);
				},
				function(module, next) {
					assert.isNotNull(module, 'Module should be not null');

					ModuleSubjectController.list(function(err, subjects) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subjects, 'Subjects should be not null');
						assert.lengthOf(subjects, 1, 'Subjects array has length of 1');
						next(err);
					}, module);
				}
			], done);
		});
	});

	describe('read', function() {
		it('should return a known subject (wba1 2014 Sommersemester) via string', function(done) {
			ModuleSubjectController.read(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');

				expect(subject).property('_id');
				expect(subject).property('__v');
				expect(subject).property('slug', '2014-1');
				expect(subject).property('module');
				expect(subject).property('semester', 'Sommersemester');
				expect(subject).property('status', 'active');

				var module = subject.module;
				expect(module).property('shortName', 'WBA 1');
				expect(module).property('name', 'Webbasierte Anwendungen 1');

				done();
			}, 'wba1', '2014', 'Sommersemester');
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

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next();
					}, module, 2014, 'Sommersemester');
				}
			], done);
		});

		it('should fail for an unknown module (unknownmodule) via string', function(done) {
			ModuleSubjectController.read(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, 'unknownmodule', 2014, 'Sommersemester');
		});
	});

	describe('create', function() {
		it('should save a new subject (WBA 1 2014 Wintersemester) with full data', function(done) {
			var subjectdata = {
				status: 'active'
			};
			async.series([
				function(next) {
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNull(subject, 'Subject should be not null');
						next(err, subject);
					});
				},
				function(next) {
					ModuleSubjectController.create(function (err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-wintersemester-wba1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err, subject);
					}, 'wba1', 2014, 'Wintersemester', subjectdata);
				},
				function(next) {
					Subject.findOne({ slug: '2014-wintersemester-wba1', year: 2014, semester: 'Wintersemester' }).populate('module').exec(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-wintersemester-wba1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Wintersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

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
			}, 'wba1', 2014, 'Wintersemester', subjectdata);
		});

		it('should fail for an already existing subject (WBA 1 2014 Sommersemester)', function(done) {
			var subjectdata = {
			};
			ModuleSubjectController.create(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');

				expect(err).property('name', 'Error');
				expect(err).property('message', 'Subject already exist!');

				done();
			}, 'wba1', 2014, 'Sommersemester', subjectdata);
		});
	});

	describe('update', function() {
		it('should successfully update a known subject (WBA 1 2014 Sommersemester) without data', function(done) {
			var newsubjectdata = {};
			async.series([
				function(next) {
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Sommersemester' }, function(err, subject) {
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
					}, 'wba1', 2014, 'Sommersemester', newsubjectdata);
				},
				function(next) {
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Sommersemester' }, function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');
						next(err);
					});
				}
			], done);
		});

		it.skip('should successfully update a known subject (WBA 1 2014 Sommersemester) with data', function(done) {
			var newmoduledata = {
				shortName: 'New shortname',
				name: 'New name'
			};
			async.series([
				function(next) {
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Sommersemester' }, function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					});
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					}, 'wba1', 2014, 'Sommersemester', newmoduledata);
				},
				function(next) {
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Sommersemester' }, function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

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
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Sommersemester' }).populate('module').exec(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					});
				},
				function(next) {
					ModuleSubjectController.update(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					}, 'wba1', 2014, 'Sommersemester', newmoduledata);
				},
				function(next) {
					Subject.findOne({ slug: '2014-1', year: 2014, semester: 'Sommersemester' }).populate('module').exec(function(err, subject) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(subject, 'Subject should be not null');

						expect(subject).property('_id');
						expect(subject).property('__v');
						expect(subject).property('slug', '2014-1');
						expect(subject).property('module');
						expect(subject).property('semester', 'Sommersemester');
						expect(subject).property('status', 'active');

						var module = subject.module;
						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

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
		it('should successfully remove a known subject (wba1 2014 Sommersemester)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(subject, 'Subject should be not null');
				done(err);
			}, 'wba1', 2014, 'Sommersemester');
		});

		it('should fail for an unknown subject (unknownmodule)', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(subject, 'Subject should be null or undefined');
				done();
			}, 'unknownmodule', 2014, 'Sommersemester');
		});

		it('should fail for an unknown year or semester', function(done) {
			ModuleSubjectController.delete(function(err, subject) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(subject, 'Subject should be null');
				done();
			}, 'wba1', 2014, 'unknownsemester');
		});
	});

});
