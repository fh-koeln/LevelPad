'use strict';

/**
 * RESTful API for evaluations.
 */

var express = require('express'),
	swag = require('bo-swag'),
	evaluations = swag.router(express.Router()),
	ModuleSubjectMemberEvaluationController = require('../controllers/ModuleSubjectMemberEvaluationController'),
	helpers = require('./_helpers');

/**
 * Get all evaluations for the current member.
 */
evaluations.get('/', {

}, function(req, res) {
	ModuleSubjectMemberEvaluationController.list(helpers.sendResult(res), req.member);
});

/**
 * Get one evaluation of the current member.
 */
evaluations.get('/:evaluationId', {

}, function(req, res) {
	ModuleSubjectMemberEvaluationController.read(helpers.sendResult(res), req.member, req.params.evaluationId);
});

/**
 * Update one evaluation of the current member.
 */
evaluations.put('/:evaluationId', {

}, function(req, res) {
	ModuleSubjectMemberEvaluationController.update(helpers.sendResult(res), req.member, req.params.evaluationId, req.body);
});

/**
 * Add an evaluation to the current member.
 */
evaluations.post('/', {

}, function(req, res) {
	ModuleSubjectMemberEvaluationController.create(helpers.sendResult(res), req.member, req.body);
});

/**
 * Remove an evaluation from the current member.
 */
evaluations.delete('/:evaluationId', {

}, function(req, res) {
	ModuleSubjectMemberEvaluationController.delete(helpers.sendResult(res), req.member, req.params.evaluationId);
});

module.exports = evaluations;
