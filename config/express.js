'use strict';

var express = require('express'),
	path = require('path'),
	helmet = require('helmet'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	favicon = require('serve-favicon'),
	MongoStore = require('connect-mongo')(session);

/**
 * Express configuration
 */
module.exports = function(app) {
	var env = app.get('env');

	// Logging
	if (env === 'development') {
		app.use(require('morgan')('dev'));
	} else if (env !== 'test') {
		app.use(require('morgan')());
	}

	// Basic request processing:
	app.use(require('cookie-parser')(process.env.COOKIE_SECRET || 'H2YlmVI=srH5DCw4xKA(IA4YZ|Gr4gutt|Lh0WD:'));

	// Session
	if (env === 'test') {
		// TODO: Or could we use mongostore in tests?
		app.use(session({
			secret: process.env.SESSION_SECRET || '&Rd65y($lbBh}=)N{U}uBL&3BXitK$G2h@C8mpew',
			resave: false,
			saveUninitialized: false
		}));
	} else {
		app.use(session({
			secret: process.env.SESSION_SECRET || '&Rd65y($lbBh}=)N{U}uBL&3BXitK$G2h@C8mpew',
			store: new MongoStore({ url: require('./db').url }),
			resave: false,
			saveUninitialized: false
		}));
	}

	app.use(bodyParser.json());
	app.use(require('connect-timeout')(10 * 1000));

	// Live reload
//	if (env === 'development') {
//		app.use(require('connect-livereload')());
//	}

	// Disable caching of scripts for easier testing
	if (env === 'development') {
		app.use(function noCache(req, res, next) {
			if (req.url.indexOf('/views/') === 0 || req.url.indexOf('/controllers/') === 0) {
				res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
				res.header('Pragma', 'no-cache');
				res.header('Expires', 0);
			}
			next();
		});
	}

	// Compression
	if (env === 'production') {
		app.use(require('compression')());
	}

	// Security
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.xframe('sameorigin'));
	app.use(helmet.hidePoweredBy());
	app.use(helmet.hsts({
		maxAge: 1000 * 60 * 60 * 24, // 1 day, increase later.
	}));

	// Static resources
	app.use(favicon( path.join(__dirname, '../public') + '/favicon.ico'));

	// TODO remove this and later. It only adds the view name to all public/views files! :-)
	app.use(function(req, res, next) {
		if (req.path.indexOf('/views/') === 0) {
			require('fs').readFile(__dirname + '/../public' + req.path, function (err, data) {
				if (err) {
					next(err);
				} else {
					res.send('<code>' + req.path + '</code>\n' + data);
				}
			});
		} else {
			next();
		}
	});

	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.static(path.join(__dirname, '../bower_components')));

	// Error handler
	if (env === 'development') {
		app.use(require('errorhandler')());
	}
};
