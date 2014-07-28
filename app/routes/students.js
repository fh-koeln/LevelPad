
var express = require('express'),
	students = express.Router(),
	User = require('../models/User'),
	helpers = require('./_helpers');

/**
 * Get all modules
 */
students.get('/', function(req, res) {
	User.find(helpers.sendResult(res));
});

/**
 * Get one module.
 */
students.get('/:slug', function(req, res) {
	User.findOne(req.params, helpers.sendResult(res));
});

/**
 * Create a new module.
 */
students.post('/', function(req, res) {
	req.body.slug = (req.body.shortName).replace(/[^A-Za-z0-9]/, '').toLowerCase();

	new User(req.body).save(helpers.sendResult(res));
});

/**
 * Update one module.
 */
students.put('/:slug', function(req, res) {
	// TODO: Verify that the ID and the slug is not changed!?
	req.body.slug = req.params.slug;

	User.findOneAndUpdate(req.params, req.body, helpers.sendResult(res));
});

/**
 * Delete one module.
 */
students.delete('/:slug', function(req, res) {
	User.findOneAndRemove(req.params, helpers.sendResult(res));
});

module.exports = students;
