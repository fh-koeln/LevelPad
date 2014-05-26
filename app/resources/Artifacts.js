var express = require('express'),
	artifacts = express.Router();

artifacts.get('/', function(req, res, next) {
	res.send('artifact index for subject' + req.params.subject );
});

artifacts.post('/', function(req, res, next) {
	res.send('create artifact');
});

artifacts.get('/:id', function(req, res, next) {
	res.send('update artifact ' + req.params.artifact);
});

artifacts.put('/:id', function(req, res, next) {
	res.send('update artifact ' + req.params.artifact);
});

artifacts.delete('/:id', function(req, res, next) {
	res.send('destroy artifact ' + req.params.artifact);
});

module.exports = artifacts;
