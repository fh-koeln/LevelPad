
var request = require('supertest'),
	server = require('../../server');

module.exports = request(server);
