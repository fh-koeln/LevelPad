'use strict';

var express = require('express'),
	path = require('path'),
	helmet = require('helmet'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session);

/**
 * Express configuration
 */
module.exports = function(app) {
	var env = app.get('env');

	// Logging
	app.use(require('morgan')(env === 'development' ? 'dev' : undefined));

	// Basic request processing:
	app.use(require('cookie-parser')(process.env.COOKIE_SECRET || 'H2YlmVI=srH5DCw4xKA(IA4YZ|Gr4gutt|Lh0WD:'));
	app.use(session({
		secret: process.env.SESSION_SECRET || '&Rd65y($lbBh}=)N{U}uBL&3BXitK$G2h@C8mpew',
		store: new MongoStore({ url: require('./db').url })
	}));
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
	app.use(helmet.iexss());
	app.use(helmet.contentTypeOptions());
	app.use(helmet.xframe('sameorigin'));
	app.use(helmet.hidePoweredBy());
	app.use(helmet.hsts());

	// Static resources
	//app.use(express.favicon(path.join(__dirname, '../public', 'favicon.ico')));
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.static(path.join(__dirname, '../../bower_components')));

	// Error handler
	if (env === 'development') {
		app.use(require('errorhandler')());
	}
};
