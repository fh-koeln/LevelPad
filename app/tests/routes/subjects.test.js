'use strict';

require('should-http');

var should = require('should'),
	db = require('../db'),
	agentsAPI = require('../agents'),
	async = require('async');

describe('Subjects API', function() {
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

	it('should return no subjects for guests', function(done) {
		agents.student3
			.get('/api/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return subjects for a student', function(done) {
		agents.student1
			.get('/api/subjects')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				var apiSubjects = res.body;
				apiSubjects.length.should.be.above(1);

				apiSubjects[0].should.have.property('semester');

				apiSubjects[0].should.have.property('module')
					.and.have.property('name');

				done(err);
			});
	});


});
