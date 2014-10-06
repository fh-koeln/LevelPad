
var express = require('express'),
	semesters = express.Router(),
	SemesterController = require('../controllers/SemesterController'),
	_helpers = require('./_helpers');

semesters.get('/', function (req, res) {
	SemesterController.list(_helpers.sendResult(res));
});

module.exports = semesters;
