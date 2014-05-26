var express = require('express'),
	artifacts = express.Router();

artifacts.param('artifact', function(req, res, next, subject, artifact) {
	Artifact.findBySubjectAndId(subject, artifact, function(err, artifact) {
		req.artifact = artifact;
		next();
	});
});

artifacts.get('/', function(req, res, next) {
	res.send('artifact index for subject' + req.params.subject );
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
