'use strict';

var supertest = require('supertest'),
	server = require('../../../server'),
	db = require('../db'),
	async = require('async');

describe('Subject resource', function() {

	var agent;

	var loginUser = function(username, password) {
		return function(callback) {
			agent = supertest.agent(server);
			agent
				.post('/api/login')
				.send({ username: username, password: password })
				.expect(200)
				.expect('set-cookie', /^connect.*/)
				.end(callback);
		};
	};

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData,
			loginUser('lecturer1', 'unused')
		], done);
	});

	it('should return no resource at beginning', function(done) {
		agent
			.get('/api/subjects')
			.expect(200)
			.end(done);
	});

	it('should not accept a new subject', function(done) {
		agent
			.post('/api/subjects')
			.expect(403)
			.end(done);
	});

});
