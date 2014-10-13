'use strict';

var supertest = require('supertest'),
	should = require('should'),
	server = require('../../../server'),
	db = require('../db'),
	async = require('async');

describe('Users API', function() {
	var newUseragent = supertest.agent(server),
		testUser = {
			username : 'pmeyer',
			password : 'unused',
			firstname : 'Peter',
			lastname : 'Meyer',
			email: 'peter.meyer@fh-koeln.de'
		};

	before(function(done) {
		async.series([
			db.clear,
			db.initializeTestData,
		], done);
	});

	it('should return 200 and a cookie when a new user does a log in', function(done) {
		newUseragent
			.post('/api/login')
			.send({ username: testUser.username, password: testUser.password })
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect('set-cookie', /^connect.*/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username', testUser.username);
				res.body.should.have.property('role', 'guest');

				done(err);
			});
	});

	it('should return 400 when a guest user signs up with no data', function(done) {
		newUseragent
			.post('/api/users')
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(done);
	});

	it('should return 400 when a guest user signs up with partial data', function(done) {
		newUseragent
			.post('/api/users')
			.send({
				username: testUser.username,
				password: testUser.password,
				firstname : testUser.firstname,
				lastname : testUser.lastname,
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('errors')
					.and.have.property('email')
					.and.have.property('message')
					.and.be.equal('Path `email` is required.');

				done(err);
			});
	});

	it('should return 200 when a guest user signs up with full data', function(done) {
		newUseragent
			.post('/api/users')
			.send({
				username: testUser.username,
				password: testUser.password,
				firstname : testUser.firstname,
				lastname : testUser.lastname,
				email: testUser.email
			})
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(testUser.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(testUser.firstname);
				res.body.should.have.property('lastname').and.be.equal(testUser.lastname);
				res.body.should.have.property('email').and.be.equal(testUser.email);
				res.body.should.have.property('role').and.be.equal('administrator'); // @todo This will fail in future, change to student

				done(err);
			});
	});

	it('should return 200 and user data for new user', function(done) {
		newUseragent
			.get('/api/users/me')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(testUser.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(testUser.firstname);
				res.body.should.have.property('lastname').and.be.equal(testUser.lastname);
				res.body.should.have.property('email').and.be.equal(testUser.email);
				res.body.should.have.property('role').and.be.equal('administrator'); // @todo This will fail in future, change to student

				done(err);
			});
	});

	it('should return 204 when user logs out', function(done) {
		newUseragent
			.post('/api/logout')
			.expect(204)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.be.empty;

				done(err);
			});

	});

	it('should return 401 after user is logged out', function(done) {
		newUseragent
			.get('/api/users/me')
			.expect(401)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				done(err);
			});
	});

});
