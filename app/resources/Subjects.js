var express = require('express'),
	subjects = express.Router(),
	Subject = require('../models/Subject.js');

subjects.use('/artifacts', require('./Artifacts'));

subjects.get('/', function(req, res, next) {
	Subject.find(function(err, subjects) {
		res.json(subjects);
	});
});

subjects.post('/', function(req, res, next) {
	res.send('create subject');
});

subjects.get('/:subject', function(req, res, next) {
	Subject.findByName(function(err, subject) {
		res.json(subject);
	});
});

subjects.put('/:subject', function(req, res, next) {
	res.send('update subject ' + req.params.subject);
});

subjects.delete('/:subject', function(req, res, next) {
	res.send('destroy subject ' + req.params.subject);
});

module.exports = subjects;
