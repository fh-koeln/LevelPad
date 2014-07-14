// Change environment
process.env.NODE_ENV = 'test';

var request = require('supertest'),
	server = require('../../server');

module.exports = request(server);
