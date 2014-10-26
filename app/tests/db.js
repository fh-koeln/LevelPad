'use strict';

var async = require('async'),
	User = require('../models/User'),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Task = require('../models/Task'),
	users = require('./users');


module.exports.clear = function(callback) {
	async.series([
		function(next) {
			Task.remove(next);
		},
		function(next) {
			Subject.remove(next);
		},
		function(next) {
			Module.remove(next);
		},
		function(next) {
			User.remove(next);
		}
	], callback);
};

module.exports.initializeTestData = function(callback) {
	async.series([
		function(next) {
			new User(users.admin1).save(next);
		},
		function(next) {
			new User(users.lecturer1).save(next);
		},
		function(next) {
			new User(users.assistant1).save(next);
		},
		function(next) {
			new User(users.student1).save(next);
		},
		function(next) {
			new User(users.student2).save(next);
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
