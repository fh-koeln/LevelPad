
var express = require('express'),
	members = express.Router(),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	User = require('../models/User'),
	ModuleSubjectMemberController = require('../controllers/ModuleSubjectMemberController'),
	helpers = require('./_helpers');

/**
 * Get all members for the current subject.
 */
members.get('/', function(req, res) {
	ModuleSubjectMemberController.list(helpers.sendResult(res), req.subject);
});

/**
 * Get one assstant for the current subject.
 */
members.get('/:memberId', function(req, res) {
	ModuleSubjectMemberController.read(helpers.sendResult(res), req.subject, req.params.memberId);
});

/**
 * Get one assstant for the current subject.
 */
members.put('/:memberId', function(req, res) {
	ModuleSubjectMemberController.update(helpers.sendResult(res), req.subject, req.params.memberId, req.body);
});

/**
 * Add a assistant to the current subject.
 */
members.post('/', function(req, res) {
	ModuleSubjectMemberController.create(helpers.sendResult(res), req.subject, req.body);
});

/**
 * Remove a assistant from the current subject.
 */
members.delete('/:slug', function(req, res) {
	Module.findOneAndRemove(req.params, helpers.sendResult(res));
});

module.exports = members;
