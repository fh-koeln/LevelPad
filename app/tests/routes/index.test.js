'use strict';

require('should-http');

var supertest = require('supertest'),
	should = require('should'),
	server = require('../../../server'),
	db = require('../db'),
	agentsAPI = require('../agents'),
	async = require('async');

describe('index.html', function() {
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

	it('should return index.html for public with a cookie', function(done) {
		var agent = supertest.agent(server);

		agent
			.get('/')
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);

				res.should.have.status(200);
				res.should.be.html;

				should.exist(res.body);

				res.headers.should.have.property('set-cookie');


				done(err);
			});
	});

	it('should return index.html for guests with a cookie', function(done) {
		agents.student3
			.get('/')
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);

				res.should.have.status(200);
				res.should.be.html;

				should.exist(res.body);

				res.headers.should.have.property('set-cookie')
					.and.match(/user=%7B%22username%22%3A%22pmeyer%22%2C%22role%22%3A%22guest%22%7D/);

				done(err);
			});
	});

	it('should return index.html for students with a cookie', function(done) {
		agents.student1
			.get('/')
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.html;

				should.exist(res.body);

				res.headers.should.have.property('set-cookie')
					.and.match(/user=%7B%22username%22%3A%22student1%22%2C%22role%22%3A%22student%22%7D/);

				done(err);
			});
	});


});
