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
		.end(callback);
};

var lecturer1 = function(callback) {
	agents.lecturer1 = supertest.agent(server);

	agents.lecturer1
		.post('/api/login')
		.send({ username: users.lecturer1.username, password: users.lecturer1.password })
		.end(callback);
};

var assistant1 = function(callback) {
	agents.assistant1 = supertest.agent(server);

	agents.assistant1
		.post('/api/login')
		.send({ username: users.assistant1.username, password: users.assistant1.password })
		.end(callback);
};

var student1 = function(callback) {
	agents.student1 = supertest.agent(server);

	agents.student1
		.post('/api/login')
		.send({ username: users.student1.username, password: users.student1.password })
		.end(callback);
};

var student2 = function(callback) {
	agents.student2 = supertest.agent(server);

	agents.student2
		.post('/api/login')
		.send({ username: users.student2.username, password: users.student2.password })
		.end(callback);
};

var student3 = function(callback) {
	agents.student3 = supertest.agent(server);

	agents.student3
		.post('/api/login')
		.send({ username: users.student3.username, password: users.student3.password })
		.end(callback);
};


module.exports.setUp = function(callback) {
	async.series([
		admin1,
		lecturer1,
		assistant1,
		student1,
		student2,
		student3
	], callback);
};

module.exports.getAll = function() {
	return agents;
};

