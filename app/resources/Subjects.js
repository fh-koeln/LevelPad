var express = require('express'),
	subjects = express.Router(),
	Subject = require('../models/Subject'),
	helpers = require('./_helpers');
	require('url');


//subjects.use('/:slug/artifacts', require('./Artifacts'));

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

module.exports = subjects;
