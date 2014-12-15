'use strict';

var Subject = require('../models/Subject'),
	Module = require('../models/Module'),
	async = require('async'),
	errors = require('common-errors'),
	moduleSubjectMemberController = require('./ModuleSubjectMemberController');

/**
 * List all subjects by module and apply an optional filter.
 *
 * @param callback
 * @param module
 * @param filter
 */
exports.list = function(callback, module, filter) {
	async.waterfall([
		function(next) {
			if (typeof module === 'string') {
				Module.findOne({ slug: module }, next);
			} else {
				next(null, module);
			}
		},
		function(module, next) {
			if (!module || !module._id) {
				return next(new errors.NotFoundError('Module'));
			}

			filter = filter || {};

			filter.module = module._id;

			Subject.find(filter).populate('module').exec(next);
		}
	], callback);

};

/**
 * Find subject by module and subject slug.
 *
 * @param callback
 * @param module
 * @param year
 * @param semester
 */
exports.read = function(callback, module, slug) {
	async.waterfall([
		function(next) {
			if (typeof module === 'string') {
				Module.findOne({ slug: module }, next);
			} else {
				next(null, module);
			}
		},
		function(module, next) {
			if (!module || !module._id) {
				return next(new errors.NotFoundError('Module'));
			}

			Subject.findOne({ module: module._id, slug: slug }).populate('module').exec(function(err, subject) {
				if (!err && !subject) {
					return next(new errors.NotFoundError('Subject'));
				}
				next(err, subject);
			});
		}
	], callback);
};

/**
 * Create a new subject based on the given subjectData.
 *
 * @param callback
 * @param module
 * @param year
 * @param semester
 * @param subjectdata
 */
exports.create = function(callback, module, subjectData) {

	async.waterfall([
		function(next) {
			if (!subjectData.year) {
				return next(new errors.ArgumentNullError('year'));
			}

			if (!subjectData.semester) {
				return next(new errors.ArgumentNullError('semester'));
			}

			if (!subjectData.creator) {
				return next(new errors.ArgumentNullError('creator'));
			}

			next(null);
		},
		function(next) {
			if (typeof module === 'string') {
				Module.findOne({ slug: module }, next);
			} else {
				next(null, module);
			}
		},
		function(module, next) {
			if (!module || !module._id) {
				return next(new errors.NotFoundError('Module'));
			}

			// check if subject already exists!
			Subject.findOne({ module: module._id, year: subjectData.year, semester: subjectData.semester }, function(err, subject) {
				if (!err && subject) {
					return next(new errors.AlreadyInUseError('Subject'));
				}
				next(err, module); // keep module
			});
		},
		function(module, next) {
			var subject = new Subject(subjectData),
				year = subjectData.year,
				semester = subjectData.semester,
				semesterSlug, yearSlug, nextYear = year + 1;

			if (semester === 'Sommersemester') {
				semesterSlug = 'sose';
				yearSlug = year.toString()[2] + year.toString()[3];
			} else if (semester === 'Wintersemester') {
				semesterSlug = 'wise';
				yearSlug = year.toString()[2] + year.toString()[3] + nextYear.toString()[2] + nextYear.toString()[3];
			}

			subject.slug = (semesterSlug + yearSlug).toLowerCase();
			subject.module = module._id;

			subject.save(next);
		},
		function(subject, numberAffected, next) {
			moduleSubjectMemberController.create(next, subject, {
				id: subjectData.creator,
				role: 'creator',
				registrationPassword: subjectData.registrationPassword
			});
		},
		function(member, next) {
			Subject.findOne({ _id: member.subject }).populate('module').exec(next);
		}
	], callback);
};

/**
 * Update the module with given moduleSlug. Moduledata are optional
 * and the module slug ifself could not changed (currently).
 *
 * @param callback
 * @param module
 * @param year
 * @param semester
 * @param subjectData
 */
exports.update = function(callback, module, slug, subjectData) {
	// TODO: Verify that the ID and the slug is not changed!?
//	subjectData.slug = subjectSlug;

	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	async.waterfall([
		function(next) {
			exports.read(next, module, slug);
		},
		function(subject, next) {
			if (subjectData.status !== undefined) {
				subject.status = subjectData.status;
			}
			if (subjectData.registrationActive !== undefined) {
				subject.registrationActive = subjectData.registrationActive;
			}
			if (subjectData.registrationExpiresAt !== undefined) {
				subject.registrationExpiresAt = subjectData.registrationExpiresAt;
			}
			if (subjectData.registrationActive !== undefined) {
				subject.registrationPassword = subjectData.registrationPassword;
			}
			subject.save(next);
		}
	], callback);
};

/**
 * Remove a subject by module and subject.
 *
 * @param callback
 * @param module
 * @param year
 * @param semester
 */
exports.delete = function(callback, module, slug) {

	// TODO add force parameter and remove module with subjects only if this parameter is true.

	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	// currently replaced because findOneAndRemove will not throw an error if the module doesn't exist anymore.
//	Module.findOneAndRemove({ module: module, year: year, semester: semester }, callback);

	async.waterfall([
		function(next) {
			exports.read(next, module, slug);
		},
		function(subject, next) {
			subject.remove(next);
		}
	], callback);
};
