'use strict';

var supertest = require('supertest'),
	server = require('../../../server'),
	db = require('../db'),
	async = require('async');

describe('Subjects API', function() {

	var agent = supertest.agent(server);

	var loginUser = function(username, password) {
		return function(callback) {
			agent
				.post('/api/login')
				.send({ username: username, password: password })
				.expect(200)
				.expect('set-cookie', /^connect.*/)
				.end(callback);
		};
	};

	before(function(done) {
		async.series([
			db.clear,
			db.initializeTestData,
			loginUser('lecturer1', 'unused')
		], done);
	});

	it('should return no resource at beginning', function(done) {
		agent
			.get('/api/users/lecturer1/subjects')
			.expect(200)
			.end(done);
	});

	it('should not accept a new subject', function(done) {
		agent
			.post('/api/users/lecturer1/subjects')
			.expect(403)
			.end(done);
	});

});
