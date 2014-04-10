'use strict';

var express = require('express');
var path = require('path');

/**
 * Express configuration
 */
module.exports = function(app) {
	var env = app.get('env');

	if (env == 'development') {
		app.use(require('morgan')('dev'));
		app.use(require('connect-livereload')());

		// Disable caching of scripts for easier testing
		app.use(function noCache(req, res, next) {
			if (req.url.indexOf('/views/') === 0 || req.url.indexOf('/controllers/') === 0) {
				res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
				res.header('Pragma', 'no-cache');
				res.header('Expires', 0);
			}
			next();
		});
	}

	if (env == 'production') {
		app.use(require('morgan')());
		app.use(require('compression')());
	}

	app.use(require('body-parser')());
	app.use(require('method-override')());

	// Routes the API calls
//		app.use(app.router);

	// Static resources
	//app.use(express.favicon(path.join(__dirname, '../public', 'favicon.ico')));
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.static(path.join(__dirname, '../../bower_components')));

	// Error handler
	if (env == 'development') {
		app.use(require('errorhandler')());
	}
};
