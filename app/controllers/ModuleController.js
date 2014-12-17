'use strict';

var Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	async = require('async'),
	errors = require('common-errors');

/**
 * List all modules and apply optional filter.
 *
 * @param callback
 * @param authUser
 * @param filter
 */
exports.list = function(callback, authUser, filter) {
	Module.find(filter, callback);
};

/**
 * Find module by slug.
 *
 * @param callback
 * @param authUser
 * @param moduleSlug
 */
exports.read = function(callback, authUser, moduleSlug) {
	Module.findOne({ slug: moduleSlug }, function(err, module) {
		if (!err && !module) {
			err = new errors.NotFoundError('Module');
		}
		callback(err, module);
	});
};

/**
 * Create a new module based on the given moduledata.
 *
 * @param callback
 * @param authUser
 * @param moduledata
 */
exports.create = function(callback, authUser, moduleData) {
	var module = new Module(moduleData);
	if (moduleData.shortName) {
		module.slug = (moduleData.shortName).replace(/[^A-Za-z0-9]/, '').toLowerCase();
	}

	async.waterfall([
		function(next) {
			module.save(next);
		},
		function(module, numberAffected, next) {

			// TODO: should be need to extend the ACLs now???

//			acl.setRole(module.username, module.role, function(err) {
//				next(err, module); // keep module result from mongoose
//			});

			next(null, module);
		}
	], callback);
};

/**
 * Update the module with given moduleSlug. Moduledata are optional
 * and the module slug ifself could not changed (currently).
 *
 * @param callback
 * @param authUser
 * @param moduleSlug
 * @param moduleData
 */
exports.update = function(callback, authUser, moduleSlug, moduleData) {
	// TODO: Verify that the ID and the slug is not changed!?
	moduleData.slug = moduleSlug;

	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	async.waterfall([
		function(next) {
			exports.read(next, authUser, moduleSlug);
		},
		function(module, next) {
			if (moduleData.shortName !== undefined) {
				module.shortName = moduleData.shortName;
			}
			if (moduleData.name !== undefined) {
				module.name = moduleData.name;
			}
			module.save(next);
		}
	], callback);
};

/**
 * Removes the module with the given moduleSlug.
 *
 * @param callback
 * @param authUser
 * @param moduleSlug
 */
exports.delete = function(callback, authUser, moduleSlug) {

	// TODO add force parameter and remove module with subjects only if this parameter is true.

	async.waterfall([
		function(next) {
			exports.read(next, authUser, moduleSlug);
		},
		function(module, next) {
			// Delete subjects related to the module
			Subject.find({
				module: module._id
			}).remove(function(err) {
				next(err, module); // keep module result from mongoose
			});
		},
		function(module, next) {
			module.remove(next);
		}
	], callback);
};
