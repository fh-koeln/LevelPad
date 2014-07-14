'use strict';

var express = require('express'),
	app = express(),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Imap = require('imap'),
	User = require('../app/models/User'),
	acl = require('./acl').acl;

var checkCredentials = function(username, password, callback) {
	// In development don't use the IMAP process
	if (app.get('env') === 'development') {
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

/**
 * Passport session setup.
 *
 * To support persistent login sessions, Passport needs to be able to
 * serialize users into and deserialize users out of the session.  Typically,
 * this will be as simple as storing the user ID when serializing, and finding
 * the user by ID when deserializing.
 */
passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	User.findByUsername(username, function (err, user) {

		if (!user) {
			// Create guest user which has to sign up
			acl.addUserRoles(username, 'guest').then(function() {
				user = new User();
				user.username = username;
				done(null, user);
			});
		} else {
			done(err, user);
		}
	});
});


/**
 * Use the LocalStrategy within Passport.
 *
 * Strategies in passport require a `verify` function, which accept
 * credentials (in this case, a username and password), and invoke a callback
 * with a user object.  In the real world, this would query a database;
 * however, in this example we are using a baked-in set of users.
 */
passport.use('fh-imap', new LocalStrategy(function(username, password, done) {
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
}));

module.exports = function(app) {

	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());

	/**
	 * POST /login validates the login
	 *
	 * Use passport.authenticate() as route middleware to authenticate the
	 * request.  If authentication fails, the user will be redirected back to the
	 * login page.  Otherwise, the primary route function function will be called,
	 * which, in this example, will redirect the user to the home page.
	 *
	 */
	app.post('/api/login', passport.authenticate('fh-imap'), function(req, res) {
		res.json(200, req.user);
	});

	/**
	 * POST /api/logout logouts the current user.
	 */
	app.post('/api/logout', function (req, res) {
		req.logout();
		res.json(200, {});
	});
};
