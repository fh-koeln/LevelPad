
var LocalStrategy = require('passport-local').Strategy,
	Imap = require('imap'),
	User = require('../../app/models/User'),
	acl = require('../acl').instance;

var checkCredentials = function(username, password, callback) {

	// Asynchronous verification, for effect...
	process.nextTick(function () {
		// Login via IMAP
		var imap = new Imap({
			user: username,
			password: password,
			host: 'imap.intranet.fh-koeln.de',
			port: 993,
			keepalive: false,
			tls: true
		});

		// Connect to IMAP-Server
		imap.connect();

		// Promise-Handler if login successful
		imap.once('ready', function() {
			imap.end();

			User.findByUsername(username, function(err, user) {
				if (err) {
					callback(null, false, err);
				} else if (!user) {
					// Create guest user which has to sign up
					acl.addUserRoles(username, 'guest', function() {
						user = new User();
						user.username = username;
						user.role = 'guest';
						callback(null, user);
					});
				} else {
					callback(null, user);
				}
			});
		});

		// Promise-Handler if login failed
		//imap.once('error', callback);
		imap.once('error', function(err) {
			callback(err);
		});
	});
};

module.exports = new LocalStrategy(function(username, password, done) {
	checkCredentials(username, password, done);
});
