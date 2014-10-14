'use strict';

var supertest = require('supertest'),
	should = require('should'),
	server = require('../../../server'),
	db = require('../db'),
	async = require('async'),
	agentsAPI = require('../agents'),
	users = require('../users');

describe('Users API', function() {
	var agents;

	function setUpAgents(done) {
		agentsAPI.setUp( function() {
			agents = agentsAPI.getAll();
			done();
		});
	}

	before(function(done) {
		async.series([
			db.clear,
			db.initializeTestData,
			setUpAgents
		], done);
	});

	it('should return 400 when a guest creates a user with no data', function(done) {
		agents.student3
			.post('/api/users')
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(done);
	});

	it('should return 400 when a guest creates a user with no email', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
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

	it('should return 400 when a guest creates a user with missing email', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
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

	it('should return 400 when a guest creates a user with missing firstname', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				lastname : users.student3.lastname,
				email : users.student3.email,
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('errors')
					.and.have.property('firstname')
					.and.have.property('message')
					.and.be.equal('Path `firstname` is required.');

				done(err);
			});
	});

	it('should return 400 when a guest creates a user with missing lastname', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				email : users.student3.email,
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('errors')
					.and.have.property('lastname')
					.and.have.property('message')
					.and.be.equal('Path `lastname` is required.');

				done(err);
			});
	});

	it('should return 400 when a guest creates a user with missing username', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
				email : users.student3.email,
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('errors')
					.and.have.property('username')
					.and.have.property('message')
					.and.be.equal('Path `username` is required.');

				done(err);
			});
	});

	it('should return 200 when a guest creates a user with full data', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
				email: users.student3.email
			})
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.student3.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(users.student3.firstname);
				res.body.should.have.property('lastname').and.be.equal(users.student3.lastname);
				res.body.should.have.property('email').and.be.equal(users.student3.email);
				res.body.should.have.property('role').and.be.equal('administrator'); // @todo This will fail in future, change to student

				done(err);
			});
	});

	it('should return 200 and users data of current user', function(done) {
		agents.student3
			.get('/api/users/me')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.student3.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(users.student3.firstname);
				res.body.should.have.property('lastname').and.be.equal(users.student3.lastname);
				res.body.should.have.property('email').and.be.equal(users.student3.email);
				res.body.should.have.property('role').and.be.equal('administrator'); // @todo This will fail in future, change to student

				done(err);
			});
	});

	it('should return 200 and users data for students', function(done) {
		agents.student2
			.get('/api/users/me')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.student2.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(users.student2.firstname);
				res.body.should.have.property('lastname').and.be.equal(users.student2.lastname);
				res.body.should.have.property('email').and.be.equal(users.student2.email);
				res.body.should.have.property('role').and.be.equal(users.student2.role);

				done(err);
			});
	});

	it('should return 200 and users data for admins', function(done) {
		agents.admin1
			.get('/api/users/me')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.admin1.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(users.admin1.firstname);
				res.body.should.have.property('lastname').and.be.equal(users.admin1.lastname);
				res.body.should.have.property('email').and.be.equal(users.admin1.email);
				res.body.should.have.property('role').and.be.equal(users.admin1.role);

				done(err);
			});
	});

	it('should return 204 when user logs out', function(done) {
		agents.student3
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
		agents.student3
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
