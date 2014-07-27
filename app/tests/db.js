
var async = require('async'),
	User = require('../models/User'),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Task = require('../models/Task'),
	acl = require('../../config/acl').acl;

module.exports.clear = function(callback) {
	async.series([
		function(callback) {
			Task.remove(callback);
		},
		function(callback) {
			Subject.remove(callback);
		},
		function(callback) {
			Module.remove(callback);
		},
		function(callback) {
			User.remove(callback);
		}
	], callback);
};

module.exports.initializeTestData = function(callback) {
	async.series([
		function(callback) {
			var user = {
				username: 'admin1',
				firstname: 'Admin1',
				lastname: 'Admin1',
				email: 'admin1@fh-koeln.de',
				role: 'administrator'
			};
			new User(user).save(callback);
		},
		function(callback) {
			var user = {
				username: 'lecturer1',
				firstname: 'Lecturer1',
				lastname: 'Lecturer1',
				email: 'lecturer1@fh-koeln.de',
				role: 'lecturer'
			};
			new User(user).save(callback);
		},
		function(callback) {
			// Create guest user which has to sign up
//			acl.addUserRoles('lecturer1', 'administrator', callback);
//			acl.addUserRoles('lecturer1', 'administrator', callback);
			callback();
		}
	], callback);
};