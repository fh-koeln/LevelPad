'use strict';

/**
 * RESTful API for members.
 */

var express = require('express'),
	swag = require('bo-swag'),
	members = swag.router(express.Router()),
	ModuleSubjectMemberController = require('../controllers/ModuleSubjectMemberController'),
	helpers = require('./_helpers');

	members.param('memberId', function (req, res, next, memberId) {
	ModuleSubjectMemberController.read(function(err, member) {
		if (err && err.name === 'NotFoundError') {
			return res.status(404).json(err);
		}

		req.member = member;
		next(err);
	}, memberId);
});

/**
 * Get all members for the current subject.
 */
members.get('/', {

}, function(req, res) {
	ModuleSubjectMemberController.list(helpers.sendResult(res), req.subject);
});

/**
 * Get one member for the current subject.
 */
members.get('/:memberId', {

}, function(req, res) {
	ModuleSubjectMemberController.read(helpers.sendResult(res), req.subject, req.params.memberId);
});

/**
 * Update one member for the current subject.
 */
members.put('/:memberId', {

}, function(req, res) {
	ModuleSubjectMemberController.update(helpers.sendResult(res), req.subject, req.params.memberId, req.body);
});

/**
 * Add a member to the current subject.
 */
members.post('/', {

}, function(req, res) {
	ModuleSubjectMemberController.create(helpers.sendResult(res), req.subject, req.body);
});

/**
 * Remove a member from the current subject.
 */
members.delete('/:memberId', {

}, function(req, res) {
	ModuleSubjectMemberController.delete(helpers.sendResult(res), req.subject, req.params.memberId);
});

/**
 * Register subresources for members.
 */
 members.use('/:memberId/evaluations', require('./evaluations'));

module.exports = members;
