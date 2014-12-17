'use strict';

/**
 * RESTful API for all subjects.
 */

var express = require('express'),
	swag = require('bo-swag'),
	allSubjects = swag.router(express.Router()),
	SubjectController = require('../controllers/SubjectController'),
	_helpers = require('./_helpers');

/**
 * Get all subjects.
 */
allSubjects.get('/', {
	summary: 'Get all subjects',
	description: 'List all subjects and apply optional filter.',
	tags: [ 'Subject' ],
}, function (req, res) {
	SubjectController.list(_helpers.sendResult(res), req.user, req.module);
});

module.exports = allSubjects;
