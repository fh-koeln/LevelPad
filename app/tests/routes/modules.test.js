'use strict';

require('should-http');

var	should = require('should'),
	db = require('../db'),
	async = require('async'),
	agentsAPI = require('../agents');

describe('Modules API', function() {
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

	it('should return 403 when a guest wants to access modules', function(done) {
		agents.student3
			.get('/api/modules')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body); // @todo Check error response

				done(err);
			});
	});

	it('should return 403 when a student wants to access modules', function(done) {
		agents.student2
			.get('/api/modules')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body); // @todo Check error response

				done(err);
			});
	});

	it('should return 200 when a lecture wants to access the modules', function(done) {
		agents.lecturer1
			.get('/api/modules')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				var modules = res.body;

				modules.should.have.a.lengthOf(2);

				modules[0].should.containEql({
					slug: 'wba1',
					shortName: 'WBA 1',
					name: 'Webbasierte Anwendungen 1'
				});

				modules[1].should.containEql({
					slug: 'wba2',
					shortName: 'WBA 2',
					name: 'Webbasierte Anwendungen 2'
				});

				done(err);
			});
	});

	it('should return 200 (change to 201!) when an admin creates a new module', function(done) {
		agents.admin1
			.post('/api/modules')
			.send({
				slug: 'eis',
				shortName: 'EIS',
				name: 'Entwicklung interaktiver System'
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal('eis');
				res.body.should.have.property('shortName').and.be.equal('EIS');
				res.body.should.have.property('name').and.be.equal('Entwicklung interaktiver System');

				done(err);
			});
	});

	it('should return 200 and data when a lecturer read a module', function(done) {
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

	it('should return 200 when an admin deletes a module', function(done) {
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

	it('should return 403 when a lecturer deletes a module', function(done) {
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

	it('should return 200 when an admin updates a module', function(done) {
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

	it('should return 404 for unknown module', function(done) {
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

