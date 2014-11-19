'use strict';

require('should-http');

var	should = require('should'),
	db = require('../db'),
	async = require('async'),
	agentsAPI = require('../agents'),
	subjects = require('../subjects');

describe('Modules Subjects Tasks API', function() {
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

	it('should return 403 when a guest wants to access module subject tasks', function(done) {
		agents.student3
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(403);
				res.should.be.json;

				should.exist(res.body); // @todo Check error response

				done(err);
			});
	});

	it('should return 404 when an admin reads tasks of an unknown subject', function(done) {
		agents.admin1
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/doesnotexist/tasks/')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 200 when an admin reads tasks of a module subject', function(done) {
		agents.admin1
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(200);
				res.should.be.json;

				should.exist(res.body);

				var apiTasks = res.body;
				apiTasks.should.have.a.lengthOf(3);

				done(err);
			});
	});

	it('should return 200 when an admin reads a single task', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var taskId = res.body[0]._id;

						next(err, taskId);
					});
			},
			function(taskId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin reads an unknown task', function(done) {
		agents.admin1
			.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/doesnotexist')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 400 when an admin creates a task with missing title', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.send({
						description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
						weight: 50
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
							.and.be.equal('title');

						next(err);
					});
			}
		], done);
	});

	it('should return 400 when an admin creates a task with missing description', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.send({
						title: 'Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr',
						weight: 50
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
							.and.be.equal('description');

						next(err);
					});
			}
		], done);
	});

	it('should return 400 when an admin creates a task with missing weight', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.send({
						title: 'Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr',
						description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
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
							.and.be.equal('weight');

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin creates a task', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.send({
						title: 'Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr',
						description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
						weight: 50
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);
						res.body.should.have.property('_id');

						next(err, res.body._id);
					});
			},
			function(taskId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('title')
							.and.be.equal('Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr');

						res.body.should.have.property('slug')
							.and.be.equal('loerem-ipsuem-dolor-sit-aemet-consetetur');

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin updates an unknown task', function(done) {
		agents.admin1
			.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/doesnotexist')
			.send({
				title: 'Foo',
				description: 'Lorem ipsum dolor sit amet.',
				weight: 73
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 200 when an admin updates a single task', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var taskId = res.body[0]._id;

						next(err, taskId);
					});
			},
			function(taskId, next){
				agents.admin1
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId)
					.send({
						title: 'Foo',
						description: 'Lorem ipsum dolor sit amet.',
						weight: 73
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('description')
							.and.be.equal('Lorem ipsum dolor sit amet.');

						res.body.should.have.property('title')
							.and.be.equal('Foo');

						res.body.should.have.property('weight')
							.and.be.equal(73);

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin deletes an unknown task', function(done) {
		agents.admin1
			.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/doesnotexist')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.should.have.status(404);
				res.should.be.json;

				should.exist(res.body);

				done(err);
			});
	});

	it('should return 200 when an admin deletes a single task', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var taskId = res.body[0]._id;

						next(err, taskId);
					});
			},
			function(taskId, next){
				agents.admin1
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});
});

