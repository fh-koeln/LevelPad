'use strict';

var ModuleController = require('../../controllers/ModuleController'),
	Module = require('../../models/Module'),
	assert = require('chai').assert,
	expect = require('chai').expect,
//	sinon = require('sinon'),
	db = require('../db'),
	async = require('async');

describe('ModuleController', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData
		], done);
	});

	describe('list', function() {
		it('should find all modules without filter (default)', function(done) {
			ModuleController.list(function(err, modules) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(modules, 'Modules should be not null');
				assert.lengthOf(modules, 2, 'Modules array has length of 2');
				done();
			});
		});
	});

	describe('read', function() {
		it('should return a known module (wba1)', function(done) {
			ModuleController.read(function(err, module) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(module, 'Module should be not null');

				expect(module).property('_id');
				expect(module).property('__v');
				expect(module).property('slug', 'wba1');
				expect(module).property('shortName', 'WBA 1');
				expect(module).property('name', 'Webbasierte Anwendungen 1');

				done();
			}, 'wba1');
		});

		it('should fail for an unknown module (unknownmodule)', function(done) {
			ModuleController.read(function(err, module) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(module, 'Module should be null');
				done();
			}, 'unknownmodule');
		});
	});

	describe('create', function() {
		it('should save a new module (GdvK) with full data', function(done) {
			var moduledata = {
				shortName: 'GdvK',
				name: 'Grundlagen der visuellen Kommunikation'
			};
			async.series([
				function(next) {
					Module.findOne({ slug: 'gdvk' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNull(module, 'Module should be not null');
						next(err);
					});
				},
				function(next) {
					ModuleController.create(function (err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'gdvk'); // automatically transformed to lowercase
						expect(module).property('shortName', 'GdvK');
						expect(module).property('name', 'Grundlagen der visuellen Kommunikation');

						next(err);
					}, moduledata);
				},
				function(next) {
					Module.findOne({ slug: 'gdvk' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'gdvk'); // automatically transformed to lowercase
						expect(module).property('shortName', 'GdvK');
						expect(module).property('name', 'Grundlagen der visuellen Kommunikation');

						next(err);
					});
				}
			], done);
		});

		it('should fail if module has no shortname or name', function(done) {
			var moduledata = {};
			ModuleController.create(function(err, module) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(module, 'Module should be null or undefined');

				expect(err).property('name', 'ValidationError');
				expect(err).property('message', 'Validation failed');

				expect(err).property('errors');
				expect(err.errors).property('shortName');
				expect(err.errors).property('name');

				done();
			}, moduledata);
		});

		it('should fail for an already existing module (wba1)', function(done) {
			var moduledata = {
				shortName: 'WBA 1',
				name: 'New module'
			};
			ModuleController.create(function(err, module) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isUndefined(module, 'Module should be null or undefined');

				expect(err).property('name', 'MongoError');
				expect(err).property('code', 11000);

				assert.property(err, 'err');
				assert.include(err.err, 'duplicate key error');

				done();
			}, moduledata);
		});
	});

	describe('update', function() {
		it('should successfully update a known module (wba1) without data', function(done) {
			var newmoduledata = {};
			async.series([
				function(next) {
					Module.findOne({ slug: 'wba1' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');
						next(err);
					});
				},
				function(next) {
					ModuleController.update(function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');
						next(err);
					}, 'wba1', newmoduledata);
				},
				function(next) {
					Module.findOne({ slug: 'wba1' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');
						next(err);
					});
				}
			], done);
		});

		it('should successfully update a known module (wba1) with data', function(done) {
			var newmoduledata = {
				shortName: 'New shortname',
				name: 'New name'
			};
			async.series([
				function(next) {
					Module.findOne({ slug: 'wba1' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'wba1');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					});
				},
				function(next) {
					ModuleController.update(function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'wba1');
						expect(module).property('shortName', 'New shortname');
						expect(module).property('name', 'New name');

						next(err);
					}, 'wba1', newmoduledata);
				},
				function(next) {
					Module.findOne({ slug: 'wba1' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'wba1');
						expect(module).property('shortName', 'New shortname');
						expect(module).property('name', 'New name');

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
					Module.findOne({ slug: 'wba1' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'wba1');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					});
				},
				function(next) {
					ModuleController.update(function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'wba1');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					}, 'wba1', newmoduledata);
				},
				function(next) {
					Module.findOne({ slug: 'wba1' }, function(err, module) {
						assert.isNull(err, 'Error should be null');
						assert.isNotNull(module, 'Module should be not null');

						expect(module).property('_id');
						expect(module).property('__v');
						expect(module).property('slug', 'wba1');
						expect(module).property('shortName', 'WBA 1');
						expect(module).property('name', 'Webbasierte Anwendungen 1');

						next(err);
					});
				}
			], done);
		});

		it('should fail for an unknown module (unknownmodule)', function(done) {
			var moduledata = {};
			ModuleController.update(function(err, module) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(module, 'Module should be null');
				done();
			}, 'unknownmodule', moduledata);
		});
	});

	describe('delete', function() {
		it('should successfully remove a known module (wba1)', function(done) {
			ModuleController.delete(function(err, module) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(module, 'Module should be not null');
				done();
			}, 'wba1');
		});

		it('should fail for an unknown module (unknownmodule)', function(done) {
			ModuleController.delete(function(err, module) {
				assert.isNotNull(err, 'Error should be not null');
				assert.isNull(module, 'Module should be null');
				done();
			}, 'unknownmodule');
		});
	});

});
