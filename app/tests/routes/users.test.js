'use strict';

var supertest = require('supertest'),
	server = require('../../../server');

describe('Users API', function() {
	it('should return 401 when trying to fetch user data without authentification', function(done) {
		var agent = supertest.agent(server);
		agent
			.get('/api/users/me')
			.expect(401)
			.end(done);
	});

});
