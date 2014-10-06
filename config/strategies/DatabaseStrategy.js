
var debug = require('debug')('DatabaseStrategy'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../../app/models/User'),
	acl = require('../acl').acl;

module.exports = new LocalStrategy(function(username, password, done) {
	debug('Search user ' + username + ' in database..');

	User.findByUsername(username, function(err, user) {
		if (err) {
			done(null, false, err);
		} else if (!user) {
			// Create guest user which has to sign up
			acl.addUserRoles(username, 'guest', function() {
				user = new User();
				user.username = username;
				user.role = 'guest';
				done(null, user);
			});
		} else {
			done(null, user);
		}
	});
});
