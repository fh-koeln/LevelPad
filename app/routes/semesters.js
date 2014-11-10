
var express = require('express'),
	swag = require('bo-swag'),
	semesters = swag.router(express.Router()),
	SemesterController = require('../controllers/SemesterController'),
	_helpers = require('./_helpers');

semesters.get('/', {
	
}, function (req, res) {
	SemesterController.list(_helpers.sendResult(res));
});

module.exports = semesters;
