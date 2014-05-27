var express = require('express'),
	subjects = express.Router(),
	Subject = require('../models/Subject.js'),
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

subjects.get('/', function(req, res, next) {
	Subject.find().populate('module', 'name').exec(function(err, subjects) {
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

// @todo Support for GET subject/{subject_id}?
subjects.get('/*', function(req, res, next) {
	// Catch for a bad request
	res.json(400, {error: 'Bad Request'});
});

subjects.put('/:subject_id', function(req, res, next) {
	res.send('update subject ' + req.params.subject_id);
});

subjects.delete('/:subject_id', function(req, res, next) {
	res.send('destroy subject_id ' + req.params.subject_id);
});

module.exports = subjects;
