/**
 * RESTful API for modules.
 */

var express = require('express'),
	modules = express.Router(),
	moduleSubjects = express.Router(),
	ModuleController = require('../controllers/ModuleController'),
	ModuleSubjectController = require('../controllers/ModuleSubjectController'),
	_helpers = require('./_helpers');

// TODO check if we could replace the :slug param or delete below.
modules.param('module', function (req, res, next, moduleSlug) {
	ModuleController.read(function(err, module) {
		req.module = module;
		next(err);
	}, moduleSlug);
});

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

//
// MODULE SUBJECTS
//

/**
 * Get all subjects for a module
 */
moduleSubjects.get('/', function (req, res) {

	/*
	 if (req.query.year || req.query.semester || req.query.shortname) {

	 if (req.query.shortName) {

	 //prepare parameter for subject-population
	 delete req.query.shortName;

	 params.match = {
	 shortName: req.query.shortName
	 };
	 }

	 if (req.query.semester === 'sose')
	 req.query.semester = 'Sommersemester';
	 else if(req.query.semester === 'wise')
	 req.query.semester = 'Wintersemester';
	 else
	 delete req.query.semester;
	 */
	ModuleSubjectController.list(_helpers.sendResult(res), req.module);
});

/**
 * Get one specific subject by slug (semester-year) for a module
 */
moduleSubjects.get('/:slug', function (req, res) {
	ModuleSubjectController.read(_helpers.sendResult(res), req.module, req.params.slug);
});

moduleSubjects.post('/', function (req, res) {
	ModuleSubjectController.create(_helpers.sendResult(res), req.module, req.body);
});

/**
 * Create or update one module by short name for a module.
 */
// moduleSubjects.put('/:year(\\d{4})/:semester(ss|ws)/:module', function (req, res) {

// 	 //generate slug
// 	 var moduleSlug = req.body.module.slug;

// 	 req.body.module = req.body.module._id;
// 	 req.body.semester = req.body.semester === 'sose' ? 'Sommersemester' : 'Wintersemester';

// 	 new Subject(req.body).save(_helpers.sendResult(res));


// 	// Variante 2
// 	Module.findByShortName(req.params.module, function (err, module) {
// 		req.params.module = module._id;
// 		req.body.module = module._id;
// 		Subject.findOneAndUpdate(req.params, req.body, {
// 			upsert: true
// 		}, _helper.sendResult(res));
// 	});
// });

/**
 * Delete one subject by slug for a module
 */
moduleSubjects.delete('/:slug', function (req, res) {
	ModuleSubjectController.delete(_helpers.sendResult(res), req.module, req.params.slug);
});

moduleSubjects.use('/tasks', require('./tasks'));
moduleSubjects.use('/students', require('./students'));
moduleSubjects.use('/assistants', require('./assistants'));

modules.use('/:module/subjects', moduleSubjects);

module.exports = modules;
