'use strict';

var async = require('async'),
	User = require('../models/User'),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Task = require('../models/Task'),
	Member = require('../models/Member'),
	users = require('./users'),
	modules = require('./modules'),
	subjects = require('./subjects');


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
			new Module(modules.wba1).save(next);
		},
		function(next) {
			new Module(modules.wba2).save(next);
		},
		function(next) {
			new Module(modules.cga).save(next);
		},
		function(next) {
			Module.findOne({ slug: subjects.wba1Wise1415.module.slug }, function(err, module) {
				if (err) {
					return next(err);
				}
				var subject = {
					slug: subjects.wba1Wise1415.slug,
					module: module,
					year: subjects.wba1Wise1415.year,
					semester: subjects.wba1Wise1415.semester,
					status: subjects.wba1Wise1415.status,
				};
				new Subject(subject).save(next);
			});
		},
		function(next) {
			Module.findOne({ slug: subjects.wba1Wise1415.module.slug }, function(err, module) {
				if (err) {
					return next(err);
				}

				Subject.findOne({ slug: subjects.wba1Wise1415.slug, module: module._id }, function(err, subject) {
					if (err) {
						return next(err);
					}

					User.findOne({ username: users.student1.username }, function(err, user) {
						if (err) {
							return next(err);
						}

						var member = new Member();
						member.user = user._id;
						member.role = 'member';
						member.save( function(err, member) {
							subject.members.push(member._id);
							subject.save(next);
						});
					});
				});
			});
		},
		function(next) {
			Module.findOne({ slug: subjects.cgaWise1415.module.slug }, function(err, module) {
				if (err) {
					return next(err);
				}
				var subject = {
					slug: subjects.cgaWise1415.slug,
					module: module,
					year: subjects.cgaWise1415.year,
					semester: subjects.cgaWise1415.semester,
					status: subjects.cgaWise1415.status,
				};
				new Subject(subject).save(next);
			});
		},
		function(next) {
			Module.findOne({ slug: subjects.wba2Sose14.module.slug }, function(err, module) {
				if (err) {
					return next(err);
				}
				var subject = {
					slug: subjects.wba2Sose14.slug,
					module: module,
					year: subjects.wba2Sose14.year,
					semester: subjects.wba2Sose14.semester,
					status: subjects.wba2Sose14.status,
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
