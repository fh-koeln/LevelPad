'use strict';

// Access Control Lists

var acl = require('acl'),
	db = require('./db'),
	pathToRegexp = require('path-to-regexp'),
	async = require('async');

acl = new acl(new acl.mongodbBackend(db.connection.db, 'acl-'));


module.exports.middleware = function middleware(req, res, next) {
	if (!req.isAuthenticated()) {
		console.log('Not authenticated');
		res.json(401, {error: 'Not authenticated'});
		return;
	}

	// Get all resources by current user role and compare to current path
	acl.whatResources(req.user.role, function(err, resources) {
		if (err) {
			res.json(500, {error: 'Unexpected authorization error'});
			return;
		}

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
			console.log( req.user.username + ' with role ' + req.user.role + ' has no permissions for ' + apiPath );
			res.json(403, {error: 'Forbidden'});
			return;
		}

		acl.isAllowed(req.user.username, reqResource, req.method, function(err, result) {
			if (err) {
				res.json(500, {error: 'Unexpected authorization error'});
				return;
			}

			if (result) {
				next();
			} else {
				console.log(req.user.username + ' with role ' + req.user.role + ' is not allowed to access resource ' + reqResource + ' via ' + req.method );
				res.json(403, {error: 'Forbidden'});
				return;
			}
		});
	});
};

module.exports.setRole = function setRole(user, role, callback) {
	/*var removeRole, addRole;

	removeRole = function(roles, callback) {
		console.log(roles);
		acl.removeUserRoles(user, roles, callback);
	};
	addRole = function(callback) {
		console.log(role);
		acl.addUserRoles(user, role, callback);
	};


	async.waterfall([
		function(cb) {
			cb(null, user);
		},
		acl.userRoles,
		removeRole,
		addRole,
		callback
	]);*/

	acl.userRoles(user, function(err, roles) {
		if (err) {
			callback(err);
		} else {
			acl.removeUserRoles(user, roles, function(err) {
				if (err) {
					callback(err);
				} else {
					acl.addUserRoles(user, role, function(err) {
						callback(err);
					});
				}
			});
		}
	});
};

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
			]
		},
		{
			roles: ['guest'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users', permissions: ['POST', 'GET']},
			]
		},
		{
			roles: ['student'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
			]
		},
		{
			roles: ['assistant'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
			]
		},
		{
			roles: ['lecturer'],
			allows: [
				{resources: 'login', permissions: ['POST']},
				{resources: 'logout', permissions: ['POST']},
				{resources: 'users/me', permissions: ['GET', 'PUT']},
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
	//acl.addUserRoles('dschilli', 'administrator');
	acl.addUserRoles('cjerolim', 'administrator');
	acl.addUserRoles('vschaef1', 'administrator');
});

module.exports.acl = acl;
