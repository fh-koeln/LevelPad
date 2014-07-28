
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
		function(next) {
			var user = {
				username: 'admin1',
				firstname: 'Admin1',
				lastname: 'Admin1',
				email: 'admin1@fh-koeln.de',
				role: 'administrator'
			};
			new User(user).save(next);
		},
		function(next) {
			var user = {
				username: 'lecturer1',
				firstname: 'Lecturer1',
				lastname: 'Lecturer1',
				email: 'lecturer1@fh-koeln.de',
				role: 'lecturer'
			};
			new User(user).save(next);
		},
		function(next) {
			var module = {
				slug: 'wba1',
				shortName: 'WBA 1',
				name: 'Webbasierte Anwendungen 1'
			};
			new Module(module).save(next);
		},
		function(next) {
			var module = {
				slug: 'wba2',
				shortName: 'WBA 2',
				name: 'Webbasierte Anwendungen 2'
			};
			new Module(module).save(next);
		},
		function(next) {
			Module.findOne({ slug: 'wba1' }, function(err, module) {
				if (err) {
					return next(err);
				}
				var subject = {
					slug: '2014-1', // TODO
					module: module,
					year: 2014,
					semester: 'Sommersemester', // TODO
					status: 'active'
				};
				new Subject(subject).save(next);
			});
		},
		function(next) {
			Module.findOne({ slug: 'wba2' }, function(err, module) {
				if (err) {
					return next(err);
				}
				var subject = {
					slug: '2014-2', // TODO
					module: module,
					year: 2014,
					semester: 'Sommersemester', // TODO
					status: 'inactive'
				};
				new Subject(subject).save(next);
			});
		},
		function(next) {
			// Create guest user which has to sign up
//			acl.addUserRoles('lecturer1', 'administrator', callback);
//			acl.addUserRoles('lecturer1', 'administrator', callback);
			next();
		}
	], callback);
};
