'use strict';

/**
 * RESTful API for evaluations.
 */

var express = require('express'),
	swag = require('bo-swag'),
	evaluations = swag.router(express.Router()),
	ModuleSubjectMemberEvaluationController = require('../controllers/ModuleSubjectMemberEvaluationController'),
	_helpers = require('./_helpers');

/**
 * Get all evaluations for the current member.
 */
evaluations.get('/', {
	tags: [ 'Evaluation' ]
}, function(req, res) {
	ModuleSubjectMemberEvaluationController.list(_helpers.sendResult(res), req.user, req.member);
});

/**
 * Get one evaluation of the current member.
 */
evaluations.get('/:evaluationId', {
	tags: [ 'Evaluation' ]
}, function(req, res) {
	ModuleSubjectMemberEvaluationController.read(_helpers.sendResult(res), req.user, req.member, req.params.evaluationId);
});

/**
 * Update one evaluation of the current member.
 */
evaluations.put('/:evaluationId', {
	tags: [ 'Evaluation' ]
}, function(req, res) {
	ModuleSubjectMemberEvaluationController.update(_helpers.sendResult(res), req.user, req.member, req.params.evaluationId, req.body);
});

/**
 * Add an evaluation to the current member.
 */
evaluations.post('/', {
	tags: [ 'Evaluation' ]
}, function(req, res) {
	req.body.createdBy = req.user._id;
	ModuleSubjectMemberEvaluationController.create(_helpers.sendResult(res), req.user, req.member, req.body);
});

/**
 * Remove an evaluation from the current member.
 */
evaluations.delete('/:evaluationId', {
	tags: [ 'Evaluation' ]
}, function(req, res) {
	ModuleSubjectMemberEvaluationController.delete(_helpers.sendResult(res), req.user, req.member, req.params.evaluationId);
});

module.exports = evaluations;
