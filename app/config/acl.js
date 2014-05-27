'use strict';

// Access Control Lists

var acl = require('acl'),
	mongoose = require('mongoose'),
	db = mongoose.connection;

acl = new acl(new acl.memoryBackend());

acl.allow([
	{
		roles: ['student'],
		allows: [
			{resources: 'account', permissions: ['GET', 'PUT']},
			{resources: 'users', permissions: []},
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
			{resources: 'subjects', permissions: ['GET']},
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
])

//acl.addUserRoles('dschilli', 'student')

module.exports = acl;
