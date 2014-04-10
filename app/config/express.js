'use strict';

var express = require('express');
var path = require('path');
var logfmt = require("logfmt");

/**
 * Express configuration
 */
module.exports = function(app) {
	app.configure('development', function(){
		app.use(express.logger('dev'));
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
	});

	app.configure('production', function(){
		app.use(logfmt.requestLogger());
		app.use(express.compress());
	});

	app.configure(function(){
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.methodOverride());

		// Routes the API calls
		app.use(app.router);

		// Static resources
		//app.use(express.favicon(path.join(__dirname, '../public', 'favicon.ico')));
		app.use(express.static(path.join(__dirname, '../public')));
		app.use(express.static(path.join(__dirname, '../../bower_components')));
	});

	// Error handler
	app.configure('development', function(){
		app.use(express.errorHandler());
	});
};
