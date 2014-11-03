
var Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	User = require('../models/User'),
	async = require('async'),
	errors = require('common-errors'),
	acl = require('../../config/acl');

/**
 * List all subjects by module and apply an optional filter.
 *
 * @param callback
 * @param module
 * @param filter
 */
exports.list = function(callback, subject) {
	async.waterfall([
		function(next) {
			if (!subject || !subject._id) {
				return next(new errors.NotFoundError('Subject'));
			}

		Subject.findById(subject._id).select('members -_id').populate('members').exec(function(err, subjectWithMembers) {
			User.populate(subjectWithMembers, {
			    path: 'members.user',
			  }, function(err, subjectWithMembersAndUsers) {
			  	if (err) {
			  		return next(err);
			  	}

			  	next(null, subjectWithMembersAndUsers.members);
			  });
		});
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
exports.create = function(callback, subject, memberData) {
		async.waterfall([
			function(next) {
				if (!memberData.id) {
					return next(new errors.ArgumentNullError('id'));
				}

				if (!memberData.role) {
					return next(new errors.ArgumentNullError('role'));
				}

				next(null, subject);
			},
			function(subject, next) {
				if (!subject || !subject._id) {
					return next(new errors.NotFoundError('Subject'));
				}

				next(null, subject);
			},
			function(subject, next) {
				var member = new Member();

				member.user = memberData.id;
				member.role = memberData.role;

				member.save(function(err) {
					if (err) {
						return next(err);
					}
					subject.members.push(member._id);
					subject.save(next);
				});

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

};
