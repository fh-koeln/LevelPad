/**
 * RESTful API to manage all subjects.
 */

var subjects = require('express').Router(),
	Subject = require('../../../models/Subject'),
	helpers = require('../../_helpers');

/**
 * Get all subjects
 */
subjects.get('/', function (req, res) {

	//req.query.* doesn't work. Don't know the reason :(
	console.log(req.query.year);

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

		Subject.find(
			req.query
		).populate(
			params
		).exec(helpers.sendResult(res));
	} else {
		Subject.find().populate('module').exec(helpers.sendResult(res));
	}
});

/**
 * Get one specific subject by slug (year-semester-module).
 */
subjects.get('/:slug', function (req, res) {
	Subject.findOne(req.params.slug, helpers.sendResult(res));
});

/*subjects.get('/', function (req, res) {
 Subject.findOne({
 year: req.query.year,
 semester: req.query.semester === 'sose' ? 'Sommersemester' : 'Wintersemester',
 moduleShort: req.query.module
 }, helpers.sendResult(res));
 });*/



subjects.post('/', function (req, res) {
	//generate slug
	var moduleSlug = req.body.module.slug;

	req.body.module = req.body.module._id;
	req.body.slug = (req.body.year + '-' + req.body.semester + '-' + moduleSlug).toLowerCase();
	req.body.semester = req.body.semester === 'sose' ? 'Sommersemester' : 'Wintersemester';

	new Subject(req.body).save(helpers.sendResult(res));
});



/**
 * Create or update one module by short name.
 */
subjects.put('/:year(\\d{4})/:semester(ss|ws)/:module', function (req, res) {

	// Variante 2
	Module.findByShortName(req.params.module, function (err, module) {
		req.params.module = module._id;
		req.body.module = module._id;
		Subject.findOneAndUpdate(req.params, req.body, {
			upsert: true
		}, helper.sendResult(res));
	});
});

/**
 * Delete one subject by slug
 */
subjects.delete('/:slug', function (req, res) {
	Subject.findOneAndRemove(req.params.slug, helpers.sendResult(res));
});

subjects.use('/tasks', require('./tasks'));
subjects.use('/students', require('./students'));
subjects.use('/assistants', require('./assistants'));

module.exports = subjects;
