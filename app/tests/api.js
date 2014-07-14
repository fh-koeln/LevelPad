// Run tests in production environment
process.env.NODE_ENV = 'production';

var request = require('supertest'),
	server = require('../../server');

request = request(server);

describe('API authentification', function() {

	describe('GET /api/users/me', function() {
		it('should return 401 when trying to fetch user data without authentification', function(done) {
			request
				.get('/api/users/me')
				.expect(401)
				.end(done);
		});
	});

	describe('POST /api/login', function() {
		it('should return 400 when trying to login without data', function(done) {
			request
				.post('/api/login')
				.expect(400)
				.end(done);
		});
	});

	describe('POST /api/login', function() {
		// IMAP times out after ~6 seconds, so increase timeout here
		this.timeout(8000);

		it('should return 401 when trying to login with false data', function(done) {
			var credentials = {
				username: 'user',
				password: 'password'
			};

			request
				.post('/api/login')
				.send(credentials)
				.expect(401)
				.end(done);
		});
	});
});
