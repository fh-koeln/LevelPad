'use strict';

var UserSubjectController = require('../../controllers/UserSubjectController'),
	User = require('../../models/User'),
	assert = require('chai').assert,
	expect = require('chai').expect,
//	sinon = require('sinon'),
	db = require('../db'),
	async = require('async');

describe('UserSubjectController', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData
		], done);
	});

	describe('list', function() {
		it.skip('should find all subjects for user (admin1)', function(done) {
			UserSubjectController.list(function(err, users) {
				assert.isNull(err, 'Error should be null');
				assert.isNotNull(users, 'Users should be not null');
				assert.lengthOf(users, 2, 'Users array has length of 2');
				done();
			}, 'admin1');
		});
	});

});
