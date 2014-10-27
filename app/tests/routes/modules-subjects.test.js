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

	it.skip('should return 200 (change to 201!) when an admin creates a new module subject', function(done) {
		agents.admin1
			.post('/api/modules/' + subjects.wba2Sose13.module.slug + '/subjects')
			.send({
				semester: subjects.wba2Sose13.semester,
				year: subjects.wba2Sose13.semester,
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

	it.skip('should return 200 and data when a lecturer read a module', function(done) {
		agents.admin1
			.get('/api/modules/wba1')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal('wba1');
				res.body.should.have.property('shortName').and.be.equal('WBA 1');
				res.body.should.have.property('name').and.be.equal('Webbasierte Anwendungen 1');

				done(err);
			});
	});

	it.skip('should return 200 when an admin deletes a module', function(done) {
		agents.admin1
			.delete('/api/modules/wba1')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});

	it.skip('should return 403 when a lecturer deletes a module', function(done) {
		agents.lecturer1
			.delete('/api/modules/wba1')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;
				should.exist(res.body);

				done(err);
			});
	});

	it.skip('should return 200 when an admin updates a module', function(done) {
		agents.admin1
			.put('/api/modules/wba1')
			.send({
				name: 'Web-basierte Anwendungen 1'
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal('wba1');
				res.body.should.have.property('shortName').and.be.equal('WBA 1');
				res.body.should.have.property('name').and.be.equal('Web-basierte Anwendungen 1');

				done(err);
			});
	});

	it.skip('should return 404 for unknown module', function(done) {
		agents.admin1
			.get('/api/modules/foo')
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

