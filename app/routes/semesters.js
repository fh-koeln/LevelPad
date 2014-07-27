
var express = require('express'),
	semesters = express.Router(),
	SemesterController = require('../controllers/SemesterController'),
	_helpers = require('../controllers/_helpers');

semesters.get('/', function (req, res) {
	SemesterController.getAll(_helpers.sendResult(res));
});

module.exports = semesters;
