'use strict';

// Access Control Lists

var acl = require('acl'),
	db = require('./db'),
	pathToRegexp = require('path-to-regexp');

acl = new acl(new acl.mongodbBackend(db.connection.db, 'acl-'));


function middleware(req, res, next) {
	console.log('ACL middleware called');
	if (!req.isAuthenticated()) {
		console.log('Not authenticated');
		res.json(401, {error: 'Not authenticated'});
		return;
	}

	// TODO: Move to model
	req.user.role = req.user.role || 'guest';

	// Get all resources by current user role and compare to current path
	acl.whatResources(req.user.role, function(err, resources) {
		console.log('get resources');
		var keys, regexp, isMatch, resource, reqResource = '',
			originalUrl = req.originalUrl,
			apiPath = originalUrl.replace(/\/?api\/?/, '').split('?')[0];

		for (resource in resources) {
			keys = [];
			regexp = pathToRegexp(resource, keys);
			isMatch = regexp.test(apiPath);

			if (isMatch) {
				reqResource = resource;
				break;
			}
		}

		if (!reqResource) {
			console.log('no resources matched');
			res.json(403, {error: 'Forbidden'});
			return;
		}

		acl.isAllowed(req.user.username, reqResource, req.method, function(err, result) {
			console.log('check resources permissions for ' + reqResource );

			if (err) {
				res.json(500, {error: 'Unexpected authorization error'});
			}

			if (result) {
				console.log('permissions okay');
				next();
			} else {
				console.log('no permissions');
				res.json(403, {error: 'Forbidden'});
			}
		});
	});
}

db.connection.on('connected', function() {
	// Define default permissions for resources
	acl.allow([
		{
			roles: ['guest'],
			allows: [
				{resources: 'account'},
				{resources: 'users', permissions: ['POST']},
				{resources: 'users/me'},
				{resources: 'users/:username'},
				{resources: 'subjects'},
				{resources: 'modules'},
				{resources: 'artifacts'},
			]
		},
		{
			roles: ['student'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users'},
				{resources: 'users/me', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'users/:username', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'subjects', permissions: ['GET']},
				{resources: 'modules', permissions: ['GET']},
				{resources: 'modules/:slug', permissions: ['GET']},
				{resources: 'artifacts', permissions: ['GET']},
			]
		},
		{
			roles: ['assistant'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users', permissions: ['GET']},
				{resources: 'users/me', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'users/:username', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'subjects', permissions: ['GET', 'PUT']},
				{resources: 'subjects/:slug', permissions: ['GET', 'POST']},
				{resources: 'modules', permissions: ['GET']},
				{resources: 'modules/:slug', permissions: ['GET', 'POST']},
				{resources: 'artifacts', permissions: ['GET']},
			]
		},
		{
			roles: ['lecturer'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users', permissions: ['GET']},
				{resources: 'users/me', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'users/:username', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'subjects', permissions: ['GET', 'POST',]},
				{resources: 'subjects/:slug', permissions: ['GET', 'POST']},
				{resources: 'modules', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'modules/:slug', permissions: ['GET', 'POST']},
				{resources: 'subjects', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
			]
		},
		{
			roles: ['administrator'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'users/me', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'users/:username', permissions: ['GET', 'PUT', 'POST']},
				{resources: 'subjects', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'subjects/:slug', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'modules', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'modules/:slug', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'artifacts', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
			]
		}
	]);

	// TODO: Remove and fetch from DB/create on POST /api/user/
	acl.addUserRoles('dschilli', 'administrator');
	acl.addUserRoles('cjerolim', 'administrator');
	acl.addUserRoles('vschaef1', 'administrator');
});

module.exports.instance = acl;
module.exports.middleware = middleware;
