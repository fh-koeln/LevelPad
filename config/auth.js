'use strict';

var passport = require('passport'),
	DatabaseStrategy = require('./strategies/DatabaseStrategy'),
	FHKIMAPStrategy = require('./strategies/FHKIMAPStrategy'),
	acl = require('./acl').acl,
	User = require('../app/models/User');

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
				user.role = 'guest';
				done(null, user);
			});
		} else {
			done(err, user);
		}
	});
});


/**
 * Use the FH-Köln IMAP Strategy (a LocalStrategy) within Passport.
 *
 * Strategies in passport require a `verify` function, which accept
 * credentials (in this case, a username and password), and invoke a callback
 * with a user object.  In the real world, this would query a database;
 * however, in this example we are using a baked-in set of users.
 */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
	passport.use('fh-imap', DatabaseStrategy);
} else {
	passport.use('fh-imap', FHKIMAPStrategy);
}

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
		res.status(200).json(req.user);
	});

	/**
	 * POST /api/logout logouts the current user.
	 */
	app.post('/api/logout', function (req, res) {
		req.logout();
		res.status(200).end();
	});
};

