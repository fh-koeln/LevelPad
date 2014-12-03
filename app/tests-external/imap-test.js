'use strict';

require('should-http');

var supertest = require('supertest'),
	should = require('should'),
	server = require('../../server');

describe('API authentification', function() {

	describe('POST /api/login', function() {
		it('should return 400 when trying to login without data', function(done) {
			var agent = supertest.agent(server);

			agent
				.post('/api/login')
				.set('Accept', 'application/json')
				.end(function(err, res) {
					should.not.exist(err);
					res.should.have.status(400);

					should.exist(res.body);

					done(err);
				});
		});
	});

	describe('POST /api/login', function() {
		// IMAP times out after ~6 seconds, so increase timeout here
		this.timeout(8000);

		it.skip('should return 401 when trying to login with false data', function(done) {
			var agent = supertest.agent(server);

			agent
				.post('/api/login')
				.send({ username: 'user', password: 'password' })
				.set('Accept', 'application/json')
				.end(function(err, res) {
					should.not.exist(err);
					res.should.have.status(401);

					should.exist(res.body);

					done(err);
				});
		});
	});
});
