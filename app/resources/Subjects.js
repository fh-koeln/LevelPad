
var express = require('express'),
	subjects = express.Router(),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	helpers = require('./_helpers'),
	acl = require('../config/acl');

subjects.use(function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.json(401, {error: 'Not authenticated'});
	}

	acl.isAllowed(req.user.username, 'subjects', req.method, function(err, result) {
		if (result) {
			next();
		} else {
			res.json(403, {error: 'Forbidden'});
		}
	});
});

subjects.use('/:year(\\d{4})/:semester(ss|ws)/:module/artifacts', require('./Artifacts'));

/**
 * Get all subjects
 */
subjects.get('/', function(req, res) {
	Subject.find().populate('module').exec(helpers.sendResult(res));
});

/**
 * Get one specific subject for the module, semester, year-combination.
 */
subjects.get('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res) {
	Subject.findOne({
		year: req.params.year,
		semester: req.params.semester === 'ss' ? 'Sommersemester' : 'Wintersemester',
		moduleShort: req.params.module
	}, helpers.sendResult(res));
});

/**
 * Get all subjects for the given year and semester (multiple modules).
 */
subjects.get('/:year(\\d{4})/:semester(ss|ws)', function(req, res, next) {
	Subject.find({
		year: req.params.year,
		semester: req.params.semester === 'ss' ? 'Sommersemester' : 'Wintersemester'
	}, helpers.sendResult(res));
});

/**
 * Get all subjects for the given year (multiple semesters and modules).
 */
subjects.get('/:year(\\d{4})', function(req, res, next) {
	Subject.find({ year: req.params.year }, helpers.sendResult(res));
});

/**
 * Create or update one module by short name.
 */
subjects.put('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res) {
	// Variante 1
//	req.params.module = req.body.module._id;
//	req.body.module = req.body.module._id;
//	Subject.findOneAndUpdate(req.params, req.body, { upsert: true }, helpers.sendResult(res));

	// Variante 2
	Module.findByShortName(req.params.module, function(err, module) {
		req.params.module = module._id;
		req.body.module = module._id;
		Subject.findOneAndUpdate(req.params, req.body, { upsert: true }, helpers.sendResult(res));
	});
});

/**
 * Delete one module by short name.
 */
subjects.delete('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res) {
	Module.findByShortName(req.params.module, function(err, module) {
		req.params.module = module._id;
		Subject.findOneAndRemove(req.params, helpers.sendResult(res));
	});
});

module.exports = subjects;
