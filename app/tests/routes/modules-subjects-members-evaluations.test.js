'use strict';

require('should-http');

var	should = require('should'),
	db = require('../db'),
	async = require('async'),
	agentsAPI = require('../agents'),
	subjects = require('../subjects');

describe('Modules Subjects Members Evaluations API', function() {
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
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/')
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

	it('should return 404 when an admin reads evaluation of an unknown member', function(done) {
		async.waterfall([
			function(next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/546a1b22c6da9447692f6df9/evaluations/')
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

	it('should return 200 when an admin reads tasks of module evaluations', function(done) {
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
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/')
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

	it('should return 200 when an admin reads a single evaluation', function(done) {
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
						var evaluationId = res.body[0].evaluations[0]._id;

						next(err, memberId, evaluationId);
					});
			},
			function(memberId, evaluationId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/' + evaluationId)
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

	it('should return 404 when an admin reads an unknown evaluation', function(done) {
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
						.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/doesnotexist')
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

	it('should return 400 when an admin creates an evaluation with missing task', function(done) {
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
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/')
					.send({
						level: '546a1b22c6da9447692f6df9',
						comment: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.'
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

	it('should return 400 when an admin creates an evaluation with missing task', function(done) {
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
							.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/')
							.send({
								task: '546a1b22c6da9447692f6df9',
								comment: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.'
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
									.and.be.equal('level');

								next(err);
							});
					}
				], done);
			});

	it('should return 400 when an admin creates an evaluation with missing comment', function(done) {
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
							.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/')
							.send({
								task: '546a1b22c6da9447692f6df9',
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
									.and.be.equal('comment');

								next(err);
							});
					}
				], done);
			});

	it('should return 200 when an admin creates an evaluation', function(done) {
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
					.post('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/')
					.send({
						task: '546a1b22c6da9447692f6df9',
						level: '646a1b22c6da9447692f6df9',
						comment: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.'
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
			function(memberId, evaluationId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/' + evaluationId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('task')
							.and.be.equal('546a1b22c6da9447692f6df9');

						res.body.should.have.property('level')
							.and.be.equal('646a1b22c6da9447692f6df9');

						res.body.should.have.property('comment')
							.and.be.equal('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.');

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin updates an unknown evaluation', function(done) {
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
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/doesnotexist')
					.send({
						task: '546a1b22c6da9447692f6df9',
						level: '646a1b22c6da9447692f6df9',
						comment: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.'
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

	it('should return 200 when an admin updates a single evaluation', function(done) {
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
						var evaluationId = res.body[0].evaluations[0]._id;

						next(err, memberId, evaluationId);
					});
			},
			function(memberId, evaluationId, next){
				agents.admin1
					.put('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/' + evaluationId)
					.send({
						task: '746a1b22c6da9447692f6df9',
						level: '846a1b22c6da9447692f6df9',
						comment: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
					})
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						res.body.should.have.property('task')
							.and.be.equal('746a1b22c6da9447692f6df9');

						res.body.should.have.property('level')
							.and.be.equal('846a1b22c6da9447692f6df9');

						res.body.should.have.property('comment')
							.and.be.equal('Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');

						next(err);
					});
			}
		], done);
	});

	it('should return 404 when an admin deletes an unknown evaluation', function(done) {
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
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/doesnotexist')
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

	it('should return 200 when an admin deletes a single evaluation', function(done) {
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
						var evaluationId = res.body[0].evaluations[0]._id;

						next(err, memberId, evaluationId);
					});
			},
			function(memberId, evaluationId, next){
				agents.admin1
					.get('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/' + evaluationId)
					.set('Accept', 'application/json')
					.end(function(err, res) {
						should.not.exist(err);
						res.should.have.status(200);
						res.should.be.json;

						should.exist(res.body);

						next(err, memberId, evaluationId);
					});
			},
			function(memberId, evaluationId, next){
				agents.admin1
					.delete('/api/modules/' + subjects.wba1Wise1415.module.slug + '/subjects/' + subjects.wba1Wise1415.slug + '/members/' + memberId + '/evaluations/' + evaluationId)
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

