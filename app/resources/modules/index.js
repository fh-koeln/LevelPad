/**
 * RESTful API for modules.
 */

var modules = require('express').Router(),
	Module = require('../../models/Module'),
	Subject = require('../../models/Subject'),
	helpers = require('../_helpers');

/**
 * Get all modules
 */
modules.get('/', function (req, res) {
	Module.find(helpers.sendResult(res));
});

/**
 * Get one module.
 */
modules.get('/:slug', function (req, res) {
	Module.findOne(req.params.slug, helpers.sendResult(res));
});

/**
 * Create a new module.
 */
modules.post('/', function (req, res) {

	req.body.slug = (req.body.shortName).replace(/[^A-Za-z0-9]/, '').toLowerCase();

	new Module(req.body).save(helpers.sendResult(res));
});

/**
 * Update one module.
 */
modules.put('/:slug', function (req, res) {
	// TODO: Verify that the ID and the slug is not changed!?
	req.body.slug = req.params.slug;

	Module.findOneAndUpdate(req.params, req.body, helpers.sendResult(res));
});

/**
 * Delete one module.
 */
modules.delete('/:slug', function (req, res) {

	//delete module
	Module.findOneAndRemove(req.params, function (err, response) {
		if (err) {
			console.error(err);
			res.json(500, err);
		} else {

			//delete subjects related to the module
			Subject.find({
				module: response._id
			}).remove(helpers.sendResult(res))
		}
	});
});


/**
 * Get all modules
 */
modules.param(':slug', function (req, res, next, slug) {
	Module.find({ slug: slug }, function(err, module) {
		if (err) {
			next(err);
		} else {
			req.module = module;
			next();
		}
	});
});

modules.use('/:slug/subjects', require('./subjects'));

module.exports = modules;
