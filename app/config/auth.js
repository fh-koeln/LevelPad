'use strict';

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Imap = require('imap'),
	User = require('../models/User');

var checkCredentials = function(username, password, callback) {
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
			User.findByUsername(username, callback);
		});

		// Promise-Handler if login failed
		imap.once('error', callback);
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
		done(err, user);
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
					done(null, false, { message: 'Unknown user ' + username });
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
	 * POST /api/signup create an new user (register the user itself).
	 */
	app.post('/api/signup', function(req, res) {
		console.log('Register: ' + req.body.username);

		// TODO: Simplify code with async.js!

		User.findByUsername(req.body.username, function(err, user) {
			if (err) {
				res.json(500, err);
			} else if (user) {
				res.json(400, { message: 'User already exist.' });
			} else {
				checkCredentials(req.body.username, req.body.password, function(err) {
					if (err) {
						res.json(403, err);
					} else {
						delete req.body.password;
						new User(req.body).save(function(err, user) {
							if (err) {
								res.json(500, err);
							} else {
								res.json(200, user);
							}
						});
					}
				});
			}
		});
	});

	/**
	 * POST /login validates the login
	 *
	 * Use passport.authenticate() as route middleware to authenticate the
	 * request.  If authentication fails, the user will be redirected back to the
	 * login page.  Otherwise, the primary route function function will be called,
	 * which, in this example, will redirect the user to the home page.
	 *
	 * curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
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
