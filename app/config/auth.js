"use strict";

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Imap = require('imap'),
	User = require('../models/User.js');


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
	done(null, user.username);
});

passport.deserializeUser(function (username, done) {
	User.findByUsername(username, function (err, user) {
		done(err, user);
	});
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use('fh-imap', new LocalStrategy(
	function (username, password, done) {
		console.log('Verify imap user: ' + username);

		// asynchronous verification, for effect...
		process.nextTick(function () {

			//Login via IMAP
			var imap = new Imap({
				user: username,
				password: password,
				host: 'imap.intranet.fh-koeln.de',
				port: 993,
				keepalive: false,
				tls: true,
			});

			//Connect to IMAP-Server
			imap.connect();

			//Promise-Handler if login successful
			imap.once('ready', function () {
				imap.end();

				User.findByUsername(username, function(error, user) {
					if (error) {
						return done(error);
					}

					if (!user) {
						return done(null, false, {
							message: 'Unknown user ' + username
						});
					}

					return done(null, user);
				});

			});

			//Promise-Handler if login failed
			imap.once('error', function (error) {
				return done(null, false, {
					message: 'Invalid username or password.'
				});
			});
		});
	}
));

module.exports = function(app) {

	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());

	// POST /login
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	//
	//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
	app.post('/api/login', passport.authenticate('fh-imap'), function (req, res) {
		res.json(req.user);
	});

	// POST /login
	//   This is an alternative implementation that uses a custom callback to
	//   acheive the same functionality.
	/*
	app.post('/login', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.flash('error', info.message);
	      return res.redirect('/login')
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/users/' + user.username);
	    });
	  })(req, res, next);
	});
	*/

	app.post('/api/logout', function (req, res) {
		req.logout();
		res.json({});
	});
}
