'use strict';

/**
 * RESTful API for semesters.
 */

var express = require('express'),
	swag = require('bo-swag'),
	semesters = swag.router(express.Router()),
	SemesterController = require('../controllers/SemesterController'),
	_helpers = require('./_helpers');

semesters.get('/', {
	summary: 'Get semesters',
	description: 'Get some semesters',
	tags: [ 'Misc' ],
}, function (req, res) {
	SemesterController.list(_helpers.sendResult(res));
});

module.exports = semesters;
