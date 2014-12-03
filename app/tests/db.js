'use strict';

var async = require('async'),
	User = require('../models/User'),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	Task = require('../models/Task'),
	Level = require('../models/Level'),
	Evaluation = require('../models/Evaluation'),
	users = require('./users'),
	modules = require('./modules'),
	subjects = require('./subjects');


module.exports.clear = function(callback) {
	async.series([
		function(next) {
			Task.remove(next);
		},
		function(next) {
			Member.remove(next);
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
		function(next) { // Add tasks
			async.waterfall([
				function(callback) {
					Module.findOne({ slug: subjects.wba1Wise1415.module.slug }, function(err, module) {
						if (err) {
							return callback(err);
						}

						callback(null, module);
					});
				},
				function(module, callback) {
					Subject.findOne({ slug: subjects.wba1Wise1415.slug, module: module._id }, function(err, subject) {
						if (err) {
							return callback(err);
						}

						callback(null, subject);
					});
				},
				function(subject, callback) {
					var tasks = subjects.wba1Wise1415.tasks;

					tasks.forEach(function(data) {
						var task = new Task();

						task.title = data.title;
						task.description = data.description;
						task.slug = data.slug;
						task.weight = data.weight;

						if (data.levels) {
							data.levels.forEach(function(data) {
								var level = new Level();

								level.rank = data.rank;
								level.title = data.title;
								level.description = data.description;
								level.isMinimum = data.isMinimum;

								task.levels.push(level);
							});
						}

						subject.tasks.push(task);
					});

					callback(null, subject);
				},
				function(subject, callback) {
					subject.save(callback);
				},
			], next);
		},
		function(next) { // Add tasks
			async.waterfall([
				function(callback) {
					Module.findOne({ slug: subjects.cgaWise1415.module.slug }, function(err, module) {
						if (err) {
							return callback(err);
						}

						callback(null, module);
					});
				},
				function(module, callback) {
					Subject.findOne({ slug: subjects.cgaWise1415.slug, module: module._id }, function(err, subject) {
						if (err) {
							return callback(err);
						}

						callback(null, subject);
					});
				},
				function(subject, callback) {
					var tasks = subjects.cgaWise1415.tasks;

					tasks.forEach(function(data) {
						var task = new Task();

						task.title = data.title;
						task.description = data.description;
						task.slug = data.slug;
						task.weight = data.weight;

						if (data.levels) {
							data.levels.forEach(function(data) {
								var level = new Level();

								level.rank = data.rank;
								level.title = data.title;
								level.description = data.description;
								level.isMinimum = data.isMinimum;

								task.levels.push(level);
							});
						}

						subject.tasks.push(task);
					});

					callback(null, subject);
				},
				function(subject, callback) {
					subject.save(callback);
				},
			], next);
		},
		function(next) { // Add members
			async.waterfall([
				function(callback) {
					Module.findOne({ slug: subjects.wba1Wise1415.module.slug }, function(err, module) {
						if (err) {
							return callback(err);
						}

						callback(null, module);
					});
				},
				function(module, callback) {
					Subject.findOne({ slug: subjects.wba1Wise1415.slug, module: module._id }, function(err, subject) {
						if (err) {
							return callback(err);
						}

						callback(null, subject);
					});
				},
				function(subject, callback) {
					User.findOne({ username: users.lecturer1.username }, function(err, lecturer) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, lecturer);
					});
				},
				function(subject, lecturer, callback) {
					var member = new Member();
					member.user = lecturer._id;
					member.subject = subject._id;
					member.role = 'creator';
					member.save( function(err, member) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, member);
					});
				},
				function(subject, member, callback) {
					subject.members.push(member._id);
					callback(null, subject);
				},
				function(subject, callback) {
					User.findOne({ username: users.student1.username }, function(err, student1) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, student1);
					});
				},
				function(subject, student1, callback) {
					var member = new Member();
					member.user = student1._id;
					member.subject = subject._id;
					member.role = 'member';

					var evaluation = new Evaluation();
					evaluation.createdBy = '546a1b22c6da9447692f6df9';
					evaluation.task = '146a1b22c6da9447692f6df9';
					evaluation.level = '346a1b22c6da9442922f6df9';

					member.evaluations.push(evaluation);

					member.save( function(err, member) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, member);
					});
				},
				function(subject, member, callback) {
					subject.members.push(member._id);
					callback(null, subject);
				},
				function(subject, callback) {
					User.findOne({ username: users.student2.username }, function(err, student2) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, student2);
					});
				},
				function(subject, student2, callback) {
					var member = new Member();
					member.user = student2._id;
					member.subject = subject._id;
					member.role = 'member';

					var evaluation = new Evaluation();
					evaluation.createdBy = '546a1b22c6da9447692f6df9';
					evaluation.task = '246a1b22c6da9447692f6df9';
					evaluation.level = '346a1b22c6da9442922f6df9';

					member.evaluations.push(evaluation);

					member.save( function(err, member) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, member);
					});
				},
				function(subject, member, callback) {
					subject.members.push(member._id);
					callback(null, subject);
				},
				function(subject, callback) {
					User.findOne({ username: users.assistant1.username }, function(err, assistant1) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, assistant1);
					});
				},
				function(subject, assistant1, callback) {
					var member = new Member();
					member.user = assistant1._id;
					member.subject = subject._id;
					member.role = 'assistant';
					member.save( function(err, member) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, member);
					});
				},
				function(subject, member, callback) {
					subject.members.push(member._id);
					callback(null, subject);
				},
				function(subject, callback) {
					subject.save(callback);
				},
			], next);
		},
		function(next) {
			// Create guest user which has to sign up
//			acl.addUserRoles('lecturer1', 'administrator', callback);
//			acl.addUserRoles('lecturer1', 'administrator', callback);
			next();
		}
	], callback);
};
