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

	beforeEach(function(done) {
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

	it('should return 400 when a guest creates a user with invalid email address', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
				email : 'foo',
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('ValidationError');

				res.body.should.have.property('errors')
					.and.have.property('email')
					.and.have.property('message')
					.and.be.equal('Die E-Mail-Adresse ist ungültig.');

				done(err);
			});
	});

	it('should return 400 when a guest creates a user with existing email address', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
				email : users.admin1.email,
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('AlreadyInUseError');

				done(err);
			});
	});

	it('should return 400 when a guest creates a user with existing student number', function(done) {
		agents.student3
			.post('/api/users')
			.send({
				username: users.student3.username,
				firstname : users.student3.firstname,
				lastname : users.student3.lastname,
				email : users.student3.email,
				studentNumber : users.student2.studentNumber,
			})
			.expect(400)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('AlreadyInUseError');

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
				res.body.should.have.property('role').and.be.equal(users.student3.role); // @todo This will fail in future, change to student

				done(err);
			});
	});

	it('should return 200 and users data for current user', function(done) {
		agents.student1
			.get('/api/users/me')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.student1.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(users.student1.firstname);
				res.body.should.have.property('lastname').and.be.equal(users.student1.lastname);
				res.body.should.have.property('email').and.be.equal(users.student1.email);
				res.body.should.have.property('role').and.be.equal(users.student1.role); // @todo This will fail in future, change to student

				done(err);
			});
	});

	it('should return 200 when user updates data', function(done) {
		agents.student1
			.put('/api/users/' + users.student1.username)
			.expect(200)
			.send({
				firstname : 'Foo'
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.student1.username);
				res.body.should.have.property('firstname').and.be.equal('Foo');
				res.body.should.have.property('lastname').and.be.equal(users.student1.lastname);
				res.body.should.have.property('email').and.be.equal(users.student1.email);

				done(err);
			});
	});

	it('should return 200 when students updates data', function(done) {
		agents.student2
			.put('/api/users/' + users.student2.username)
			.expect(200)
			.send({
				firstname : 'Foo'
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.student2.username);
				res.body.should.have.property('firstname').and.be.equal('Foo');
				res.body.should.have.property('lastname').and.be.equal(users.student2.lastname);
				res.body.should.have.property('email').and.be.equal(users.student2.email);

				done(err);
			});
	});

	it('should return 400 when user updates to existing email address', function(done) {
		agents.student1
			.put('/api/users/' + users.student1.username)
			.expect(400)
			.send({
				email : users.student2.email
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('AlreadyInUseError');

				done(err);
			});
	});

	it('should return 400 when user updates to existing student number', function(done) {
		agents.student1
			.put('/api/users/' + users.student1.username)
			.expect(400)
			.send({
				studentNumber : users.student2.studentNumber,
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('AlreadyInUseError');

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

	it('should return 200 and users data for lecturers', function(done) {
		agents.lecturer1
			.get('/api/users/me')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				res.body.should.have.property('username').and.be.equal(users.lecturer1.username);
				res.body.should.not.have.property('password');
				res.body.should.have.property('firstname').and.be.equal(users.lecturer1.firstname);
				res.body.should.have.property('lastname').and.be.equal(users.lecturer1.lastname);
				res.body.should.have.property('email').and.be.equal(users.lecturer1.email);
				res.body.should.have.property('role').and.be.equal(users.lecturer1.role);

				done(err);
			});
	});

	it('should return 403 when student wants to delete their account', function(done) {
		agents.student1 // student3 is admin...
			.delete('/api/users/' + users.student1.username)
			.expect(403)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				done(err);
			});
	});

	it('should return 403 when student wants to delete another student', function(done) {
		agents.student1
			.delete('/api/users/' + users.student2.username)
			.expect(403)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

				done(err);
			});
	});

	it('should return 204 when user logs out', function(done) {
		agents.student1
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
		async.series([
		    function(next){
		    	agents.student2
			        .post('/api/logout')
			        .expect(204)
			        .end(function(err, res) {
			        	should.not.exist(err);
			        	should.exist(res.body);

			        	res.body.should.be.empty;

			        	next(err);
			        });
		    },
		    function(next){
		    	agents.student2
			        .get('/api/users/me')
			        .expect(401)
			        .set('Accept', 'application/json')
			        .expect('Content-Type', /json/)
			        .end(function(err, res) {
			        	should.not.exist(err);
			        	should.exist(res.body);

			        	next(err);
			        });
		    }
		], done);
	});
});
