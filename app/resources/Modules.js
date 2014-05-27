
var express = require('express'),
	modules = express.Router(),
	Module = require('../models/Module.js');

/**
 * Get all modules
 */
modules.get('/', function(req, res) {
	Module.find(function(err, modules) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(200, modules);
		}
	});
});

/**
 * Get one module by short name.
 */
modules.get('/:shortName', function(req, res) {
	Module.findOne(req.params, function(err, module) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(200, module);
		}
	});
});

/**
 * Create or update one module by short name.
 */
modules.put('/:shortName', function(req, res) {
	Module.findOneAndUpdate(req.params, req.body, { upsert: true }, function(err, module) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(200, module);
		}
	});
});

/**
 * Delete one module by short name.
 */
modules.delete('/:shortName', function(req, res) {
	Module.findOneAndRemove(req.params, req.body, function(err, module) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(200, module);
		}
	});
});

module.exports = modules;
