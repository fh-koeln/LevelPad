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
			res.json(404, {error: 'Not found'});
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
	/**
	 * Define default permissions for resources
	 *
		{resources: 'login', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'logout', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'users', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'users/me', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'users/:user', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'subjects', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject/tasks', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject/tasks/:task', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject/tasks/:task/teams', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
		{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback', permissions: ['GET', 'PUT', 'POST', 'DELETE']},
	 */

	acl.allow([
		{
			roles: ['public'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users'},
				{resources: 'users/me'},
				{resources: 'users/:user'},
				{resources: 'subjects'},
				{resources: 'modules'},
				{resources: 'modules/:module'},
				{resources: 'modules/:module/subjects'},
				{resources: 'modules/:module/subjects/:subject'},
				{resources: 'modules/:module/subjects/:subject/tasks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback'},
			]
		},
		{
			roles: ['guest'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users', permissions: ['POST']},
				{resources: 'users/me'},
				{resources: 'users/:user'},
				{resources: 'subjects'},
				{resources: 'modules'},
				{resources: 'modules/:module'},
				{resources: 'modules/:module/subjects'},
				{resources: 'modules/:module/subjects/:subject'},
				{resources: 'modules/:module/subjects/:subject/tasks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback'},
			]
		},
		{
			roles: ['student'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users'},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
				{resources: 'users/:user'},
				{resources: 'subjects'},
				{resources: 'modules'},
				{resources: 'modules/:module'},
				{resources: 'modules/:module/subjects'},
				{resources: 'modules/:module/subjects/:subject'},
				{resources: 'modules/:module/subjects/:subject/tasks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback'},
			]
		},
		{
			roles: ['assistant'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users'},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
				{resources: 'users/:user'},
				{resources: 'subjects'},
				{resources: 'modules/:module'},
				{resources: 'modules/:module/subjects'},
				{resources: 'modules/:module/subjects/:subject'},
				{resources: 'modules/:module/subjects/:subject/tasks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback'},
			]
		},
		{
			roles: ['lecturer'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users'},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
				{resources: 'users/:user'},
				{resources: 'subjects'},
				{resources: 'modules'},
				{resources: 'modules/:module'},
				{resources: 'modules/:module/subjects'},
				{resources: 'modules/:module/subjects/:subject'},
				{resources: 'modules/:module/subjects/:subject/tasks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks'},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback'},
			]
		},
		{
			roles: ['administrator'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users', permissions: ['GET', 'POST']},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
				{resources: 'users/:user', permissions: ['GET', 'PUT', 'DELETE']},
				{resources: 'subjects', permissions: ['GET']},
				{resources: 'modules', permissions: ['GET', 'POST']},
				{resources: 'modules/:module', permissions: ['GET', 'PUT', 'DELETE']},
				{resources: 'modules/:module/subjects', permissions: ['GET', 'POST']},
				{resources: 'modules/:module/subjects/:subject', permissions: ['GET', 'PUT', 'DELETE']},
				{resources: 'modules/:module/subjects/:subject/tasks', permissions: ['GET', 'POST']},
				{resources: 'modules/:module/subjects/:subject/tasks/:task', permissions: ['GET', 'PUT', 'DELETE']},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams', permissions: ['GET', 'POST', 'DELETE']},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team', permissions: ['GET', 'POST', 'DELETE']},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks', permissions: ['GET', 'POST', 'DELETE']},
				{resources: 'modules/:module/subjects/:subject/tasks/:task/teams/:team/feedbacks/:feedback', permissions: ['GET', 'PUT', 'DELETE']},
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
