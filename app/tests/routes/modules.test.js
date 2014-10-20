'use strict';

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

	it('should return 403 when a guest wants to access the modules', function(done) {
		agents.student3
			.post('/api/modules')
			.set('Accept', 'application/json')
			.expect(403)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				should.not.exist(err);
				should.exist(res.body);

			//	console.log(res);

				done(err);
			});
	});

	it.skip('should return 200 when a student wants to access the modules', function(done) {
		agents.student2
			.post('/api/modules')
			.expect(200)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.end(done);
	});

});
