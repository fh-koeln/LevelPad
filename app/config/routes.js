'use strict';

var express = require('express'),
	api = express.Router(),
	acl = require('../config/acl');

// API is only available for authenticated users.
api.use(acl.middleware);

api.use('/modules', require('../resources/Modules'));
api.use('/subjects', require('../resources/Subjects'));
api.use('/users', require('../resources/Users'));

var routes = express.Router();
routes.use('/api', api);


var explorer = function(router) {
	var simplifyRegexUrl = function(url, keys) {
		// Convert regex to string
		if ((typeof url) === 'object') {
			url = url.toString();
		}

		// Remove regex prefix "/^" and optional slash suffx "\/?$/i" or "\/?(?=/|$)/i"
		if (url.indexOf('/^') === 0) {
			url = url.substring(2);
		}
		if (url.lastIndexOf('\\/?$/i') === url.length - 6) {
			url = url.substring(0, url.length - 6);
		}
		if (url.lastIndexOf('\\/?(?=/|$)') === url.length - 12) {
			url = url.substring(0, url.length - 12);
		}

		// Simplify "\/?" and "\/" to "/"
		url = url.replace(/\\\/?/g, '/').replace(/\\\//g, '/');

		for (var i = 0; i < keys.length; i++) {
			url = url.replace('(?:([^/]+?))', keys[i].name);
		}

		return url;
	};

	var pushRoutes = function(urlPrefix, router, routes) {

		for (var i = 0; i < router.stack.length; i++) {

			var urlPart = simplifyRegexUrl(router.stack[i].regexp, router.stack[i].keys);

			// Handle sub-router
			if (router.stack[i].handle && router.stack[i].handle.stack) {
				console.log('push routes');
				pushRoutes(urlPrefix + urlPart, router.stack[i].handle, routes);
				continue;
			}

			// Handle route handler
			if (router.stack[i].route) {
				console.log('add route');
				console.log(router.stack[i]);

				var route = {
					url: urlPrefix + urlPart
				};

				if (router.stack[i].route && router.stack[i].route.methods) {
					console.log(router.stack[i].route.methods);
					route.methods = router.stack[i].route.methods;
				}

				routes.push(route);
			}
		}

	};

	return function(req, res) {
		var routes = [];
		pushRoutes('', router,routes);
		res.json(200, routes);
	};
};

// debug globals
routes.use('/explorer', function(req, res, next) {
	console.log('api');
	console.log(api);
	console.log('routes');
	console.log(routes);
	next();
});
routes.get('/explorer', explorer(routes));
routes.post('/explorer', function(req, res, next) { next(); });


/* GET home page for. */
routes.get('/*', function(req, res) {
    res.sendfile('index.html', { root: __dirname + '/../public' });
});

module.exports = routes;
