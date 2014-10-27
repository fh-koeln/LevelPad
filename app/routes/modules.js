/**
 * RESTful API for modules.
 */

var express = require('express'),
	modules = express.Router(),
	moduleSubjects = express.Router(),
	ModuleController = require('../controllers/ModuleController'),
	ModuleSubjectController = require('../controllers/ModuleSubjectController'),
	_helpers = require('./_helpers');

modules.param('moduleSlug', function (req, res, next, moduleSlug) {
	ModuleController.read(function(err, module) {
		if (err && err.name === 'NotFoundError') {
			return res.status(404).json(err);
		}

		req.module = module;
		next(err);
	}, moduleSlug);
});

/**
 * Get all modules.
 */
modules.get('/', function (req, res) {
	ModuleController.list(_helpers.sendResult(res));
});

/**
 * Create a module.
 */
modules.post('/', function (req, res) {
	ModuleController.create(_helpers.sendResult(res), req.body);
});

/**
 * Read a module.
 */
modules.get('/:moduleSlug', function (req, res) {
	ModuleController.read(_helpers.sendResult(res), req.params.moduleSlug);
});

/**
 * Update a module.
 */
modules.put('/:moduleSlug', function (req, res) {
	ModuleController.update(_helpers.sendResult(res), req.params.moduleSlug, req.body);
});

/**
 * Delete a module.
 */
modules.delete('/:moduleSlug', function (req, res) {
	ModuleController.delete(_helpers.sendResult(res), req.params.moduleSlug);
});

//
// MODULE SUBJECTS
//

/**
 * Get all subjects for a module.
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
 * Create a new subject.
 */
moduleSubjects.post('/', function (req, res) {
	ModuleSubjectController.create(_helpers.sendResult(res), req.module, req.body);
});

/**
 * Read a subject for a module.
 */
moduleSubjects.get('/:subjectSlug', function (req, res) {
	ModuleSubjectController.read(_helpers.sendResult(res), req.module, req.params.subjectSlug);
});

/**
 * Update a subject for a module.
 */
moduleSubjects.put('/:subjectSlug', function (req, res) {
	ModuleSubjectController.update(_helpers.sendResult(res), req.module, req.params.subjectSlug, req.body);
});

/**
 * Delete a subject for a module.
 */
moduleSubjects.delete('/:subjectSlug', function (req, res) {
	ModuleSubjectController.delete(_helpers.sendResult(res), req.module, req.params.subjectSlug);
});

/**
 * Register subresources for subjects.
 */
moduleSubjects.use('/:subjectSlug/tasks', require('./tasks'));
moduleSubjects.use('/:subjectSlug/students', require('./students'));
moduleSubjects.use('/:subjectSlug/assistants', require('./assistants'));

/**
 * Register subresources for modules.
 */
modules.use('/:moduleSlug/subjects', moduleSubjects);

module.exports = modules;
