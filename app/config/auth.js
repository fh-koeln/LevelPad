
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Imap = require('imap');



var users = [
	{
		id: 1,
		username: 'vschaef1',
		password: 'secret',
		email: 'bob@example.com'
	}
  , {
		id: 2,
		username: 'joe',
		password: 'birthday',
		email: 'joe@example.com'
	}
  , {
		id: 3,
		username: 'cjerolim',
		email: 'bob@example.com'
	}
];

function findById(id, callbackFn) {
	var idx = id - 1;
	if (users[idx]) {
		callbackFn(null, users[idx]);
	} else {
		callbackFn(new Error('User ' + id + ' does not exist'));
	}
}

function findByUsername(username, callbackFn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return callbackFn(null, user);
		}
	}
	return callbackFn(null, null);
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	findById(id, function (err, user) {
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
		console.log('Verify imap user: ' + username + ' / ' + password);

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

				findByUsername(username, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: 'Unknown user ' + username
						});
					}
					return done(null, user);
				})
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

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send(403, 'Sorry! you cant see that.');
}

module.exports = function(app) {

	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/user/me', ensureAuthenticated, function (req, res) {
		res.json(req.user);
	});

	// POST /login
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	//
	//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
	app.post('/login', passport.authenticate('fh-imap'), function (req, res) {
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

	app.post('/logout', function (req, res) {
		req.logout();
		res.json({});
	});
}
