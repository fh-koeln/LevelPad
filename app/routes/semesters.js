
var express = require('express'),
	semesters = express.Router(),
	SemesterController = require('../controllers/SemesterController');

semesters.get('/', SemesterController.getAll);

module.exports = semesters;
