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

	before(function(done) {
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

				should.exist(res.body); // @todo Check error response

				done(err);
			});
	});
});

