var express = require('express'),
	artifacts = express.Router(),
	Subject = require('../models/Subject.js');

artifacts.param('artifact', function(req, res, next, subject, artifact) {
	Artifact.findBySubjectAndId(subject, artifact, function(err, artifact) {
		req.artifact = artifact;
		next();
	});
});

artifacts.get('/', function(req, res, next) {
	console.log(req);
	Subject.findOne({
		year: req.params.year,
		semester: req.params.semester === 'ss' ? 'Sommersemester' : 'Wintersemester',
		moduleShort: req.params.module
	}, function(err, subject) {
		res.send(subject._id);
	});
});

artifacts.post('/', function(req, res, next) {
	res.send('create artifact');
});

artifacts.get('/:artifact', function(req, res, next) {
	res.send('update artifact ' + req.params.id);
});

artifacts.put('/:artifact', function(req, res, next) {
	res.send('update artifact ' + req.params.id);
});

artifacts.delete('/:artifact', function(req, res, next) {
	res.send('destroy artifact ' + req.params.id);
});

module.exports = artifacts;