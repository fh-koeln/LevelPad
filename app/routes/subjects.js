
var express = require('express'),
	subjects = express.Router(),
	Subject = require('../models/Subject'),
	Module = require('../models/Module'),
	helpers = require('./_helpers');

//subjects.use('/:slug/artifacts', require('./Artifacts'));

/**
 * Get all subjects
 */
subjects.get('/', function (req, res) {
	if (req.query.year || req.query.semester || req.query.module) {

		//convert Semester shortname to longname
		if (req.query.semester === 'sose') {
			req.query.semester = 'Sommersemester';
		} else if (req.query.semester === 'wise') {
			req.query.semester = 'Wintersemester';
		} else {
			delete req.query.semester;
		}

		//Select ID from module-collection by shortname
		if (req.query.module) {
			Module.findBySlug(req.query.module, function (err, module) {
				if (err) {
					res.status(500).json(err);
				} else if (module) {
					req.query.module = module._id;
				}
				findSubjects(req, res);
			});
		}
		else {
			findSubjects(req,res);
		}

	} else {
		Subject.find().populate('module').exec(helpers.sendResult(res));
	}
});

//Helper-Function
function findSubjects(req, res) {
	Subject.find(
		req.query
	).populate({
		path: 'module'
	}).exec(helpers.sendResult(res));

}

module.exports = subjects;
