var express = require('express'),
	subjects = express.Router(),
	Subject = require('../models/Subject'),
	Module = require('../models/Module'),
	helpers = require('./_helpers');
require('url');


//subjects.use('/:slug/artifacts', require('./Artifacts'));

/**
 * Get all subjects
 */
subjects.get('/', function (req, res) {
	if (req.query.year || req.query.semester || req.query.shortName) {
		
		//convert Semester shortname to langname
		if (req.query.semester === 'sose')
			req.query.semester = 'Sommersemester';
		else if (req.query.semester === 'wise')
			req.query.semester = 'Wintersemester';
		else
			delete req.query.semester;

		//Select ID from module-collection by shortname
		if (req.query.shortName) {
			Module.findByShortName(req.query.shortName, function (err, module) {
				console.log('MODULE: ' + module);
				if (err) {
					console.error(err);
					res.json(500, err);
				} 
				
				else if (module) {
					req.query.module = module._id;
					delete req.query.shortName;

				}
				findSubjects(req, res);
			});
		}
		else
			findSubjects(req,res);

	} else {
		Subject.find().populate('module').exec(helpers.sendResult(res));
	}
});

//Helper-Function
function findSubjects(req, res) {
	Subject.find(
		req.query
	).populate({
		path: 'module',
	}).exec(helpers.sendResult(res));

}

/**
 * Get one specific subject by slug (year-semester-module).
 */
subjects.get('/:slug', function (req, res) {
	Subject.findOne(req.params.slug, helpers.sendResult(res));
});


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

module.exports = subjects;