'use strict';

var async = require('async'),
	acl = require('../../config/acl'),
	User = require('../models/User'),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	Task = require('../models/Task'),
	Level = require('../models/Level'),
	Evaluation = require('../models/Evaluation'),
	Comment = require('../models/Comment'),
	users = require('./users'),
	modules = require('./modules'),
	subjects = require('./subjects');


module.exports.clear = function(callback) {
	async.series([
		function(next) {
			Evaluation.remove(next);
		},
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
		},
		function(next) {
			User.remove(next);
		},
		function(next) {
			acl.removeRoles(users.admin1.username, next);
		},
		function(next) {
			acl.removeRoles(users.lecturer1.username, next);
		},
		function(next) {
			acl.removeRoles(users.assistant1.username, next);
		},
		function(next) {
			acl.removeRoles(users.student1.username, next);
		},
		function(next) {
			acl.removeRoles(users.student2.username, next);
		},
		function(next) {
			acl.removeRoles(users.student3.username, next);
		},
		function(next) {
			//acl.removeAllowRules(acl.rules, next);
			next();
		},
	], callback);
};

module.exports.initializeTestData = function(callback) {
	async.series([
		function(next) {
			acl.addAllowRules(next);
		},
		function(next) {
			new User(users.admin1).save(next);
		},
		function(next) {
			acl.setRole(users.admin1.username, users.admin1.role, next);
		},
		function(next) {
			new User(users.lecturer1).save(next);
		},
		function(next) {
			acl.setRole(users.lecturer1.username, users.lecturer1.role, next);
		},
		function(next) {
			new User(users.assistant1).save(next);
		},
		function(next) {
			acl.setRole(users.assistant1.username, users.assistant1.role, next);
		},
		function(next) {
			new User(users.student1).save(next);
		},
		function(next) {
			acl.setRole(users.student1.username, users.student1.role, next);
		},
		function(next) {
			new User(users.student2).save(next);
		},
		function(next) {
			acl.setRole(users.student2.username, users.student2.role, next);
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
			Module.findOne({ slug: subjects.wba2Sose15.module.slug }, function(err, module) {
				if (err) {
					return next(err);
				}
				var subject = {
					slug: subjects.wba2Sose15.slug,
					module: module,
					year: subjects.wba2Sose15.year,
					semester: subjects.wba2Sose15.semester,
					status: subjects.wba2Sose15.status,
					registrationActive: subjects.wba2Sose15.registrationActive,
					registrationPassword: subjects.wba2Sose15.registrationPassword
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
					Subject.findOne({ slug: subjects.wba1Wise1415.slug, module: module._id }).populate('module').exec( function(err, subject) {
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

						var resources = [
							'modules/' + subject.module.slug + '/subjects/' + subject.slug,
							'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks',
							'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task',
						];
						acl.instance.allow(lecturer.username, resources, ['GET'], function(err) {
							if (err) {
								return next(err);
							}

							callback(null, subject, member);
						});
					});
				},
				function(subject, lecturer, callback) {
					subject.members.push(lecturer._id);
					callback(null, subject, lecturer);
				},
				function(subject, lecturer, callback) {
					User.findOne({ username: users.student1.username }, function(err, student1) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, lecturer, student1);
					});
				},
				function(subject, lecturer, student1, callback) {
					var member = new Member();
					member.user = student1._id;
					member.subject = subject._id;
					member.role = 'member';

					var evaluation = new Evaluation();
					evaluation.createdBy = lecturer._id;
					evaluation.task = subject.tasks[0]._id;
					evaluation.level = subject.tasks[0].levels[0]._id;

					member.evaluations.push(evaluation);

					var comment = new Comment();
					comment.createdBy = lecturer._id;
					comment.task = subject.tasks[0]._id;
					comment.text = 'Ein Kommentar';

					member.comments.push(comment);

					member.save( function(err, member) {
						if (err) {
							return callback(err);
						}

						var resources = [
							'modules/' + subject.module.slug + '/subjects/' + subject.slug,
							'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks',
							'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task',
						];
						acl.instance.allow(student1.username, resources, ['GET'], function(err) {
							if (err) {
								return next(err);
							}

							callback(null, subject, lecturer, member);
						});
					});
				},
				function(subject, lecturer, member, callback) {
					subject.members.push(member._id);
					callback(null, subject, lecturer);
				},
				function(subject, lecturer, callback) {
					User.findOne({ username: users.student2.username }, function(err, student2) {
						if (err) {
							return callback(err);
						}

						callback(null, subject, lecturer, student2);
					});
				},
				function(subject, lecturer, student2, callback) {
					var member = new Member();
					member.user = student2._id;
					member.subject = subject._id;
					member.role = 'member';

					var evaluation = new Evaluation();
					evaluation.createdBy = lecturer._id;
					evaluation.task = subject.tasks[0]._id;
					evaluation.level = subject.tasks[0].levels[0]._id;

					member.evaluations.push(evaluation);
					var comment = new Comment();
					comment.createdBy = lecturer._id;
					comment.task = subject.tasks[0]._id;
					comment.text = 'Irgendein Kommentar';

					member.comments.push(comment);

					member.save( function(err, member) {
						if (err) {
							return callback(err);
						}

						var resources = [
							'modules/' + subject.module.slug + '/subjects/' + subject.slug,
							'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks',
							'modules/' + subject.module.slug + '/subjects/' + subject.slug + '/tasks/:task',
						];
						acl.instance.allow(student2.username, resources, ['GET'], function(err) {
							if (err) {
								return next(err);
							}

							callback(null, subject, member);
						});
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
