'use strict';

var supertest = require('supertest'),
	server = require('../../server'),
	users = require('./users'),
	async = require('async'),
	agents = {};


var admin1 = function(callback) {
	agents.admin1 = supertest.agent(server);

	agents.admin1
		.post('/api/login')
		.send({ username: users.admin1.username, password: users.admin1.password })
		.end(function(err) {
			callback(err);
		});
}

var student1 = function(callback) {
	agents.student1 = supertest.agent(server);

	agents.student1
		.post('/api/login')
		.send({ username: users.student1.username, password: users.student1.password })
		.end(function(err) {
			callback(err);
		});
}

var student2 = function(callback) {
	agents.student2 = supertest.agent(server);

	agents.student2
		.post('/api/login')
		.send({ username: users.student2.username, password: users.student2.password })
		.end(function(err) {
			callback(err);
		});
}

var student3 = function(callback) {
	agents.student3 = supertest.agent(server);

	agents.student3
		.post('/api/login')
		.send({ username: users.student3.username, password: users.student3.password })
		.end(function(err) {
			callback(err);
		});
}


module.exports.setUp = function(callback) {
	async.waterfall([
		admin1,
		student1,
		student2,
		student3
	], callback);
};

module.exports.getAll = function() {
	return agents;
};

