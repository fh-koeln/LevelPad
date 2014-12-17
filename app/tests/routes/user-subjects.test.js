'use strict';

require('should-http');

var should = require('should'),
	db = require('../db'),
	agentsAPI = require('../agents'),
	async = require('async'),
	subjects = require('../subjects'),
	users = require('../users');

describe('User Subjects API', function() {
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

	it.skip('should return no subjects at beginning for guests', function(done) {
		agents.student3
			.get('/api/users/' + users.student3.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return no subjects of other users for guests', function(done) {
		agents.student3
			.get('/api/users/' + users.student1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return subjects at beginning a student', function(done) {
		agents.student1
			.get('/api/users/' + users.student1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				var apiSubjects = res.body;
				apiSubjects.should.have.a.lengthOf(1);

				apiSubjects[0].should.have.property( 'subject' )
					.and.have.property('semester')
					.and.be.equal(subjects.wba1Wise1415.semester);

				apiSubjects[0].should.have.property( 'subject' )
					.and.have.property('module')
					.and.have.property('name')
					.and.be.equal(subjects.wba1Wise1415.module.name);

				done(err);
			});
	});

	it('should return 404 for an unknown user', function(done) {
		agents.admin1
			.get('/api/users/doesnotexist/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return no subjects of other users for students', function(done) {
		agents.student1
			.get('/api/users/' + users.student2.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return subjects at beginning for assistant', function(done) {
		agents.assistant1
			.get('/api/users/' + users.assistant1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return no subjects of other users for assistant', function(done) {
		agents.assistant1
			.get('/api/users/' + users.student1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return subjects at beginning for lecturer', function(done) {
		agents.lecturer1
			.get('/api/users/' + users.lecturer1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				var apiSubjects = res.body;
				apiSubjects.should.have.a.lengthOf(1);

				apiSubjects[0].should.have.property( 'subject' )
					.and.have.property('semester')
					.and.be.equal(subjects.wba1Wise1415.semester);

				apiSubjects[0].should.have.property( 'subject' )
					.and.have.property('module')
					.and.have.property('name')
					.and.be.equal(subjects.wba1Wise1415.module.name);

				done(err);
			});
	});

	it('should return no subjects of other users for lecturer', function(done) {
		agents.lecturer1
			.get('/api/users/' + users.student2.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return subjects at beginning for admin', function(done) {
		agents.admin1
			.get('/api/users/' + users.admin1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return subjects of other users for admin', function(done) {
		agents.admin1
			.get('/api/users/' + users.student1.username + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

});
