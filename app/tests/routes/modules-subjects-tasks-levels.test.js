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

	it('should return 403 when a guest wants to access module subject members evaluations', function(done) {
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
				agents.student1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(403);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin reads level of an unknown task', function(done) {
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
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/doesnotexist/levels/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(404);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin reads levels of a task', function(done) {
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

						var apiLevels = res.body;
						apiLevels.should.have.a.lengthOf(4);

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin reads a single level', function(done) {
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
						var levelId = res.body[0].levels[0]._id;

						next(err, taskId, levelId);
					});
			},
			function(taskId, levelId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/' + levelId)
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

	it('should return 404 when an admin reads an unknown level', function(done) {
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
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/doesnotexist')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(404);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});

	it('should return 400 when an admin creates a level with missing title', function(done) {
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
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/')
					.send({
						description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
						isMinimum: true
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

	it('should return 400 when an admin creates a level with missing description', function(done) {
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
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/')
					.send({
						title: 'Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr',
						isMinimum: false
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

	it('should return 200 when an admin creates a level', function(done) {
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
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/')
					.send({
						title: 'Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr',
						description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
						isMinimum: true
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);
						res.body.should.have.property('_id');

						next(err, taskId, res.body._id);
					});
			},
			function(taskId, levelId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/' + levelId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('title')
							.and.be.equal('Lörem ipsüm dolor sit ämet, consetetur sedipscing elitr');

						res.body.should.have.property('isMinimum')
							.and.be.equal(true);

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin updates an unknown level', function(done) {
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
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/doesnotexist')
					.send({
						title: 'Foo',
						description: 'Lorem ipsum dolor sit amet.',
						isMinimum: true
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(404);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin updates a single level', function(done) {
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
						var levelId = res.body[0].levels[0]._id;

						next(err, taskId, levelId);
					});
			},
			function(taskId, levelId, next){
				agents.admin1
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/' + levelId)
					.send({
						title: 'Foo',
						description: 'Lorem ipsum dolor sit amet.',
						isMinimum: true
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

						res.body.should.have.property('isMinimum')
							.and.be.equal(true);

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin deletes an unknown level', function(done) {
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
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/doesnotexist')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(404);
						res.should.be.json;

						should.exist(res.body);

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin deletes a single level', function(done) {
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
						var levelId = res.body[0].levels[0]._id;

						next(err, taskId, levelId);
					});
			},
			function(taskId, levelId, next){
				agents.admin1
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/tasks/' + taskId + '/levels/' + levelId)
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

