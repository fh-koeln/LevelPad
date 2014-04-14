'use strict';

var express = require('express');
var path = require('path');

/**
 * Express configuration
 */
module.exports = function(app) {
	var env = app.get('env');

	// Logging
	app.use(require('morgan')(env == 'development' ? 'dev' : undefined));

	// Basic request processing:
	// TODO secrets
	app.use(require('cookie-parser')('cookie secret'));
	app.use(require('express-session')({ secret: 'session secret' }));
	app.use(require('body-parser')());
	app.use(require('connect-timeout')(10 * 1000));
//	app.use(require('method-override')());

	// Live reload
	if (env == 'development') {
		app.use(require('connect-livereload')());
	}

	// Disable caching of scripts for easier testing
	if (env == 'development') {
		app.use(function noCache(req, res, next) {
			if (req.url.indexOf('/views/') === 0 || req.url.indexOf('/controllers/') === 0) {
				res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
				res.header('Pragma', 'no-cache');
				res.header('Expires', 0);
			}
			next();
		});
	}

	// Authentification
	require('./auth')(app);

	// Compression
	if (env == 'production') {
		app.use(require('compression')());
	}

	// Static resources
	//app.use(express.favicon(path.join(__dirname, '../public', 'favicon.ico')));
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.static(path.join(__dirname, '../../bower_components')));

	// Error handler
	if (env == 'development') {
		app.use(require('errorhandler')());
	}
};
