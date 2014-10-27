'use strict';

require('should-http');

var	should = require('should'),
	db = require('../db'),
	async = require('async'),
	modules = require('../modules'),
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

				modules.should.have.a.lengthOf(3);

				modules[0].should.containEql({
					slug: modules.wba1.slug,
					shortName: modules.wba1.shortName,
					name: modules.wba1.name
				});

				modules[1].should.containEql({
					slug: modules.wba2.slug,
					shortName: modules.wba2.shortName,
					name: modules.wba2.name
				});

				modules[2].should.containEql({
					slug: modules.eis.slug,
					shortName: modules.eis.shortName,
					name: modules.eis.name
				});

				done(err);
			});
	});

	it('should return 200 (change to 201!) when an admin creates a new module', function(done) {
		agents.admin1
			.post('/api/modules')
			.send({
				slug: modules.eis.slug,
				shortName: modules.eis.shortName,
				name: modules.eis.name
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal(modules.eis.slug);
				res.body.should.have.property('shortName').and.be.equal(modules.eis.shortName);
				res.body.should.have.property('name').and.be.equal(modules.eis.name);

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

				res.body.should.have.property('slug').and.be.equal(modules.wba1.slug);
				res.body.should.have.property('shortName').and.be.equal(modules.wba1.shortName);
				res.body.should.have.property('name').and.be.equal(modules.wba1.name);

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
				name: modules.wba1.name
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;
				should.exist(res.body);

				res.body.should.have.property('slug').and.be.equal(modules.wba1.slug);
				res.body.should.have.property('shortName').and.be.equal(modules.wba1.shortName);
				res.body.should.have.property('name').and.be.equal(modules.wba1.name);

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

