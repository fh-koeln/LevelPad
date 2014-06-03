
var express = require('express'),
	subjects = express.Router(),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	helpers = require('./_helpers');


subjects.use('/:slug/artifacts', require('./Artifacts'));

/**
 * Get all subjects
 */
subjects.get('/', function(req, res) {
	Subject.find().populate('module').exec(helpers.sendResult(res));
});

subjects.get('/:slug', function(req, res) {
	res.json(200, {message: 'jo'});
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
subjects.get('/:year(\\d{4})/:semester(ss|ws)', function(req, res) {
	Subject.find({
		year: req.params.year,
		semester: req.params.semester === 'ss' ? 'Sommersemester' : 'Wintersemester'
	}, helpers.sendResult(res));
});

/**
 * Get all subjects for the given year (multiple semesters and modules).
 */
subjects.get('/:year(\\d{4})', function(req, res) {
	Subject.find({ year: req.params.year }, helpers.sendResult(res));
});

/**
 * Create or update one module by short name.
 */
subjects.put('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res) {

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
