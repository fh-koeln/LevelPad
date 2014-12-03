'use strict';

require('should-http');

var	should = require('should'),
	db = require('../db'),
	async = require('async'),
	agentsAPI = require('../agents'),
	subjects = require('../subjects');

describe('Modules Subjects Members Comments API', function() {
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

	it('should return 403 when a guest wants to access module subject members comments', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;

						next(err, memberId);
					});
			},
			function(memberId, next){
				agents.student3
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(403);
						res.should.be.json;

						should.exist(res.body); // @todo Check error response

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin reads comment of an unknown member', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/546a1b22c6da9447692f6df9/comments/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(404);
						res.should.be.json;

						should.exist(res.body); // @todo Check error response

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin reads tasks of module comments', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;

						next(err, memberId);
					});
			},
			function(memberId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var apiTasks = res.body;
						apiTasks.should.have.a.lengthOf(1);

						next(err);
					});
			}
		], done);
	});

	it('should return 200 when an admin reads a single comment', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;
						var commentId = res.body[0].comments[0]._id;

						next(err, memberId, commentId);
					});
			},
			function(memberId, commentId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/' + commentId)
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

	it('should return 404 when an admin reads an unknown comment', function(done) {
			async.waterfall([
				function(next){
					agents.admin1
						.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
						.set('Accept', 'application/json')
						.end(function(err, res) {
							should.not.exist(err);
							res.should.have.status(200);
							res.should.be.json;

							should.exist(res.body);

							var memberId = res.body[0]._id;

							next(err, memberId);
						});
				},
				function(memberId, next){
					agents.admin1
						.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/doesnotexist')
						.set('Accept', 'application/json')
						.end(function(err, res) {
							should.not.exist(err);
							res.should.have.status(404);
							res.should.be.json;

							should.exist(res.body); // @todo Check error response

							next(err);
						});
				}
			], done);
		});

	it('should return 400 when an admin creates a comment with missing task', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;

						next(err, memberId);
					});
			},
			function(memberId, next){
				agents.admin1
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/')
					.send({
						level: '546a1b22c6da9447692f6df9'
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
							.and.be.equal('task');

						next(err);
					});
			}
		], done);
	});

	it('should return 400 when an admin creates a comment with missing text', function(done) {
		async.waterfall([
					function(next){
						agents.admin1
							.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
							.set('Accept', 'application/json')
							.end(function(err, res) {
								should.not.exist(err);
								res.should.have.status(200);
								res.should.be.json;

								should.exist(res.body);

								var memberId = res.body[0]._id;

								next(err, memberId);
							});
					},
					function(memberId, next){
						agents.admin1
							.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/')
							.send({
								task: '546a1b22c6da9447692f6df9',
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
									.and.be.equal('text');

								next(err);
							});
					}
				], done);
			});

	it('should return 200 when an admin creates a comment', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;

						next(err, memberId);
					});
			},
			function(memberId, next){
				agents.admin1
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/')
					.send({
						task: '546a1b22c6da9447692f6df9',
						text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.'
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);
						res.body.should.have.property('_id');

						next(err, memberId, res.body._id);
					});
			},
			function(memberId, commentId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/' + commentId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('task')
							.and.be.equal('546a1b22c6da9447692f6df9');

						res.body.should.have.property('text')
							.and.be.equal('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.');

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin updates an unknown comment', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;

						next(err, memberId);
					});
			},
			function(memberId, next){
				agents.admin1
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/doesnotexist')
					.send({
						task: '546a1b22c6da9447692f6df9',
						text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.'
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

	it('should return 200 when an admin updates a single comment', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;
						var commentId = res.body[0].comments[0]._id;

						next(err, memberId, commentId);
					});
			},
			function(memberId, commentId, next){
				agents.admin1
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/' + commentId)
					.send({
						task: '746a1b22c6da9447692f6df9',
						text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('task')
							.and.be.equal('746a1b22c6da9447692f6df9');

						res.body.should.have.property('text')
							.and.be.equal('Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin deletes an unknown comment', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;

						next(err, memberId);
					});
			},
			function(memberId, next){
				agents.admin1
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/doesnotexist')
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

	it('should return 200 when an admin deletes a single comment', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/?role=member')
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						var memberId = res.body[0]._id;
						var commentId = res.body[0].comments[0]._id;

						next(err, memberId, commentId);
					});
			},
			function(memberId, commentId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/' + commentId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						next(err, memberId, commentId);
					});
			},
			function(memberId, commentId, next){
				agents.admin1
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/comments/' + commentId)
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

