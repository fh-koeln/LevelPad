'use strict';

// Access Control Lists

var acl = require('acl'),
	db = require('./db');

acl = new acl(new acl.mongodbBackend(db.connection.db, 'acl_'));

db.connection.on('connected', function() {
	// Define default permissions for resources
	acl.allow([
		{
			roles: ['guest'],
			allows: [
				{resources: 'account'},
				{resources: 'users', permissions: ['POST']},
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
				{resources: 'subjects', permissions: ['GET']},
				{resources: 'modules', permissions: ['GET']},
				{resources: 'artifacts', permissions: ['GET']},
			]
		},
		{
			roles: ['assistant'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users', permissions: ['GET']},
				{resources: 'subjects', permissions: ['GET', 'PUT']},
				{resources: 'modules', permissions: ['GET']},
				{resources: 'artifacts', permissions: ['GET']},
			]
		},
		{
			roles: ['lecturer'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users', permissions: ['GET']},
				{resources: 'subjects', permissions: ['GET', 'POST', 'PUT']},
				{resources: 'modules', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'subjects', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
			]
		},
		{
			roles: ['admin'],
			allows: [
				{resources: 'account', permissions: ['GET', 'PUT']},
				{resources: 'users', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'subjects', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'modules', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
				{resources: 'artifacts', permissions: ['GET', 'POST', 'PUT', 'DELETE']},
			]
		}
	]);

	acl.addUserRoles('dschilli', 'admin');
	acl.addUserRoles('cjerolim', 'admin');
	acl.addUserRoles('vschaef1', 'admin');
});

module.exports = acl;
