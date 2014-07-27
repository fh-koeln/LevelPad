/**
 * RESTful API for modules.
 */

var express = require('express'),
	modules = express.Router(),
	ModuleController = require('../controllers/ModuleController'),
	_helpers = require('./_helpers');

/**
 * Get all modules
 */
modules.get('/', function (req, res) {
	ModuleController.list(_helpers.sendResult(res));
});

/**
 * Get one module.
 */
modules.get('/:slug', function (req, res) {
	ModuleController.read(_helpers.sendResult(res), req.params.slug);
});

/**
 * Create a new module.
 */
modules.post('/', function (req, res) {
	ModuleController.create(_helpers.sendResult(res), req.body);
});

/**
 * Update one module.
 */
modules.put('/:slug', function (req, res) {
	ModuleController.update(_helpers.sendResult(res), req.params.slug, req.body);
});

/**
 * Delete one module.
 */
modules.delete('/:slug', function (req, res) {
	ModuleController.delete(_helpers.sendResult(res), req.params.slug);
});

/**
 * Get all modules
 */
modules.param(':slug', function (req, res, next, slug) {
	ModuleController.read(function(err, module) {
		req.module = module;
		next(err);
	}, slug);
});

modules.use('/:slug/subjects', require('./modules/subjects/index'));

module.exports = modules;
