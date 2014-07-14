'use strict';

var server = require('../server');

describe('API authentification', function() {
	it('should return 401 when trying to fetch user data without authentification', function(done) {
		server
			.get('/api/users/me')
			.expect(401)
			.end(done);
	});

});
