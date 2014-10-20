
var Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	async = require('async'),
	errors = require('common-errors'),
	acl = require('../../config/acl');

/**
 * List all modules and apply optional filter.
 *
 * @param callback
 * @param filter
 */
exports.list = function(callback, filter) {
	Module.find(filter, callback);
};

/**
 * Find module by slug.
 *
 * @param callback
 * @param moduleSlug
 */
exports.read = function(callback, moduleSlug) {
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
 * @param moduledata
 */
exports.create = function(callback, moduleData) {
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
 * @param moduleSlug
 * @param moduleData
 */
exports.update = function(callback, moduleSlug, moduleData) {
	// TODO: Verify that the ID and the slug is not changed!?
	moduleData.slug = moduleSlug;

	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	async.waterfall([
		function(next) {
			exports.read(next, moduleSlug);
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
 * @param moduleSlug
 */
exports.delete = function(callback, moduleSlug) {

	// TODO add force parameter and remove module with subjects only if this parameter is true.

	// TODO: could we remove the find here and change the check based on the numberAffected callback argument?
	// currently replaced because findOneAndRemove will not throw an error if the module doesn't exist anymore.
//	Module.findOneAndRemove({ slug: moduleSlug }, callback);

	async.waterfall([
		function(next) {
			exports.read(next, moduleSlug);
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
