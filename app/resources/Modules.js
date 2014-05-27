
var express = require('express'),
	modules = express.Router(),
	Module = require('../models/Module'),
	helpers = require('./_helpers');

/**
 * Get all modules
 */
modules.get('/', function(req, res) {
	Module.find(helpers.sendResult(res));
});

/**
 * Get one module by short name.
 */
modules.get('/:shortName', function(req, res) {
	Module.findOne(req.params, helpers.sendResult(res));
});

/**
 * Create or update one module by short name.
 */
modules.put('/:shortName', function(req, res) {
	Module.findOneAndUpdate(req.params, req.body, { upsert: true }, helpers.sendResult(res));
});

/**
 * Delete one module by short name.
 */
modules.delete('/:shortName', function(req, res) {
	Module.findOneAndRemove(req.params, req.body, helpers.sendResult(res));
});

module.exports = modules;
