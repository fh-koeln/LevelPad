'use strict';

require('should-http');

var	should = require('should'),
	db = require('../db'),
	async = require('async'),
	agentsAPI = require('../agents'),
	subjects = require('../subjects');

describe('Modules Subjects API', function() {
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

	it('should return 403 when a guest wants to access module subjects', function(done) {
		agents.student3
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body); // @todo Check error response

				done(err);
			});
	});

	// Needs ACL
	it.skip('should return 200 when a student is a member of a module subject', function(done) {
		agents.student2
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	// Needs ACL
	it.skip('should return 200 when a lecture is a creator of a module subject', function(done) {
		agents.lecturer1
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 200 when an admin reads a module subject', function(done) {
		agents.admin1
			.get('/api/modules/' + subjects.wba2Sose13.module.slug + '/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				var apiSubjects = res.body;

				apiSubjects.should.have.a.lengthOf(2);

				done(err);
			});
	});

	it('should return 400 when an admin creates a new module subject with missing year', function(done) {
		agents.admin1
			.post('/api/modules/' + subjects.wba2Sose13.module.slug + '/subjects')
			.send({
				semester: subjects.wba2Sose13.semester,
				status: subjects.wba2Sose13.status
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(400);
				res.should.be.json;

				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('ArgumentNullError');

				res.body.should.have.property('argumentName')
					.and.be.equal('year');

				done(err);
			});
	});

	it('should return 400 when an admin creates a new module subject with missing semester', function(done) {
		agents.admin1
			.post('/api/modules/' + subjects.wba2Sose13.module.slug + '/subjects')
			.send({
				year: subjects.wba2Sose13.year,
				status: subjects.wba2Sose13.status
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(400);
				res.should.be.json;

				should.exist(res.body);

				res.body.should.have.property('name')
					.and.be.equal('ArgumentNullError');

				res.body.should.have.property('argumentName')
					.and.be.equal('semester');

				done(err);
			});
	});

	it('should return 200 (change to 201!) when an admin creates a new module subject', function(done) {
		agents.admin1
			.post('/api/modules/' + subjects.wba2Sose13.module.slug + '/subjects')
			.send({
				semester: subjects.wba2Sose13.semester,
				year: subjects.wba2Sose13.year,
				status: subjects.wba2Sose13.status
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 200 and data when an admin reads a subject', function(done) {
		agents.admin1
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal(subjects.wba1Wise1415.slug);
				res.body.should.have.property('semester').and.be.equal(subjects.wba1Wise1415.semester);
				res.body.should.have.property('year').and.be.equal(subjects.wba1Wise1415.year);

				done(err);
			});
	});

	it('should return 200 when an admin updates a subject', function(done) {
		agents.admin1
			.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug)
			.send({
				status: 'inactive'
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal(subjects.wba1Wise1415.slug);
				res.body.should.have.property('semester').and.be.equal(subjects.wba1Wise1415.semester);
				res.body.should.have.property('year').and.be.equal(subjects.wba1Wise1415.year);
				res.body.should.have.property('status').and.be.equal('inactive');

				done(err);
			});
	});

	it('should return 200 when an admin deletes a module', function(done) {
		agents.admin1
			.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});

	it('should return 403 when a student deletes a subject', function(done) {
		agents.student3
			.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});

	it('should return 403 when a guest deletes a subject', function(done) {
		agents.student3
			.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});

	it('should return 404 for unknown module', function(done) {
		agents.admin1
			.get('/api/modules/' + 'unknown' + '/subjects/' + subjects.wba1Wise1415.slug)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});

	it('should return 404 for unknown subject', function(done) {
		agents.admin1
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + 'sose18')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});
});

