'use strict';

var express = require('express');
var path = require('path');

/**
 * Express configuration
 */
module.exports = function(app) {
	var env = app.get('env');

	// Logging
	app.use(require('morgan')(env === 'development' ? 'dev' : undefined));

	// Basic request processing:
	// TODO secrets
	app.use(require('cookie-parser')('cookie secret'));
	var session = require('express-session');
	var MongoStore = require('connect-mongo')(session);
	app.use(session({
		secret: 'session secret',
		store: new MongoStore({ url: require('./db').url })
	}));
	app.use(require('body-parser')());
	app.use(require('connect-timeout')(10 * 1000));

	// Live reload
	if (env === 'development') {
		app.use(require('connect-livereload')());
	}

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

	// Static resources
	//app.use(express.favicon(path.join(__dirname, '../public', 'favicon.ico')));
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.static(path.join(__dirname, '../../bower_components')));

	// Error handler
	if (env === 'development') {
		app.use(require('errorhandler')());
	}
};
