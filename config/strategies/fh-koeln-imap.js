
var LocalStrategy = require('passport-local').Strategy,
	Imap = require('imap'),
	User = require('../../app/models/User'),
	acl = require('../acl').acl;

var checkCredentials = function(username, password, callback) {
	// In development don't use the IMAP process
	if (process.env.NODE_ENV === 'development') {
		console.log('Search user ' + username + ' in database..');
		User.findByUsername(username, function(err, user) {
			if (err) {
				callback(null, false, err);
			} else if (!user) {
				// Create guest user which has to sign up
				acl.addUserRoles(username, 'guest', function() {
					user = new User();
					user.username = username;
					callback(null, user);
				});
			} else {
				callback(null, user);
			}
		});
		return;
	}

	console.log('Check IMAP credentials for user ' + username + '...');

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
			console.log(err);
			callback(err);
		});
	});
};

module.exports = new LocalStrategy(function(username, password, done) {
	checkCredentials(username, password, function(err) {
		if (err) {
			done(null, false, err);
		} else {
			User.findByUsername(username, function(err, user) {
				if (err) {
					done(null, false, err);
				} else if (!user) {
					// Create guest user which has to sign up
					acl.addUserRoles(username, 'guest', function() {
						user = new User();
						user.username = username;
						done(null, user);
					});
				} else {
					done(null, user);
				}
			});
		}
	});
});
