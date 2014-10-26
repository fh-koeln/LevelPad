'use strict';

require('should-http');

var supertest = require('supertest'),
	should = require('should'),
	server = require('../../../server'),
	db = require('../db'),
	async = require('async'),
	users = require('../users');

describe('Login API', function() {

	beforeEach(function(done) {
		async.series([
			db.clear,
			db.initializeTestData,
		], done);
	});

	it('should return 200 and a cookie when a new user logs in', function(done) {
		var agent = supertest.agent(server);

		agent
			.post('/api/login')
			.send({ username: users.student3.username, password: users.student3.password })
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				res.headers.should.have.property('set-cookie')
					.and.match(/^connect.*/);

				done(err);
			});
	});

	it('should return 400 when a new user logs in without password', function(done) {
		var agent = supertest.agent(server);

		agent
			.post('/api/login')
			.send({ username: users.student3.username })
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(400);

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 200 when an existing user logs in', function(done) {
		var agent = supertest.agent(server);

		agent
			.post('/api/login')
			.send({ username: users.admin1.username, password: users.admin1.password })
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				res.headers.should.have.property('set-cookie')
					.and.match(/^connect.*/);

				res.body.should.have.property('username', users.admin1.username);
				res.body.should.have.property('role', users.admin1.role);

				done(err);
			});
	});
});
