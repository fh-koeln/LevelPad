'use strict';

/**
 * RESTful API for modules.
 */

var express = require('express'),
	swag = require('bo-swag'),
	modules = swag.router(express.Router()),
	ModuleController = require('../controllers/ModuleController'),
	_helpers = require('./_helpers');

modules.param('moduleSlug', function (req, res, next, moduleSlug) {
	ModuleController.read(function(err, module) {
		if (err) {
			if (err.name === 'ValidationError' || err.name === 'AlreadyInUseError' || err.name === 'ArgumentNullError' || err.name === 'TypeError') {
				return res.status(400).json(err);
			} else if (err.name === 'NotFoundError') {
				return res.status(404).json(err);
			} else {
				return res.status(500).json(err);
			}
		}

		req.module = module;
		next(err);
	}, moduleSlug);
});

/**
 * Get all modules.
 */
modules.get('/', {

}, function (req, res) {
	ModuleController.list(_helpers.sendResult(res));
});

/**
 * Create a module.
 */
modules.post('/', {

}, function (req, res) {
	ModuleController.create(_helpers.sendResult(res), req.body);
});

/**
 * Read a module.
 */
modules.get('/:moduleSlug', {

}, function (req, res) {
	ModuleController.read(_helpers.sendResult(res), req.params.moduleSlug);
});

/**
 * Update a module.
 */
modules.put('/:moduleSlug', {

}, function (req, res) {
	ModuleController.update(_helpers.sendResult(res), req.params.moduleSlug, req.body);
});

/**
 * Delete a module.
 */
modules.delete('/:moduleSlug', {

}, function (req, res) {
	ModuleController.delete(_helpers.sendResult(res), req.params.moduleSlug);
});

/**
 * Register subresources for modules.
 */
modules.use('/:moduleSlug/subjects', require('./subjects'));

module.exports = modules;
