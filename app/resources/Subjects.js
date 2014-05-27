var express = require('express'),
	subjects = express.Router(),
	Subject = require('../models/Subject.js');

subjects.use(function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.json(401, {error: 'Not authenticated'});
	} else {
		next();
	}
});

subjects.use('/:year(\\d{4})/:semester(ss|ws)/:module/artifacts', require('./Artifacts'));

subjects.get('/', function(req, res, next) {
	Subject.find(function(err, subjects) {
		if (!err && subjects) {
			res.json(subjects);
		} else if (!err) {
			res.json([]);
		} else {
			console.log(err);
			next();
		}
	});
});

subjects.post('/', function(req, res, next) {
	res.send('create subject');
});

subjects.get('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res, next) {
	Subject.find( {
		year: req.params.year,
		semester: req.params.semester === 'ss' ? 'Sommersemester' : 'Wintersemester',
		moduleShort: req.params.module
	}, function(err, subjects) {
		if (!err && subjects) {
			res.json(subjects);
		} else if (!err) {
			res.json(404, {error: 'Not found'});
		} else {
			console.log(err);
			next();
		}
	});
});

subjects.get('/:year(\\d{4})/:semester(ss|ws)', function(req, res, next) {
	Subject.find( {
		year: req.params.year,
		semester: req.params.semester === 'ss' ? 'Sommersemester' : 'Wintersemester'
	}, function(err, subjects) {
		if (!err && subjects) {
			res.json(subjects);
		} else if (!err) {
			res.json([]);
		} else {
			console.log(err);
			next();
		}
	});
});

subjects.get('/:year(\\d{4})', function(req, res, next) {
	Subject.find( {year: req.params.year}, function(err, subjects) {
		if (!err && subjects) {
			res.json(subjects);
		} else if (!err) {
			res.json([]);
		} else {
			console.log(err);
			next();
		}
	});
});

/**
 * Create or update one module by short name.
 */
subjects.put('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res) {
	Subject.findOneAndUpdate(req.params, req.body, { upsert: true }, function(err, module) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(200, module);
		}
	});
});

/**
 * Delete one module by short name.
 */
subjects.delete('/:year(\\d{4})/:semester(ss|ws)/:module', function(req, res) {
	Subject.findOneAndRemove(req.params, req.body, function(err, module) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(200, module);
		}
	});
});

module.exports = subjects;
