'use strict';

/**
 * RESTful API for members.
 */

var express = require('express'),
	swag = require('bo-swag'),
	members = swag.router(express.Router()),
	ModuleSubjectMemberController = require('../controllers/ModuleSubjectMemberController'),
	_helpers = require('./_helpers');

members.param('memberId', function (req, res, next, memberId) {
	ModuleSubjectMemberController.read(function(err, member) {
		if (err) {
			return _helpers.sendResult(res)(err);
		}

		req.member = member;
		next(err);
	}, req.user, req.subject, memberId);
});

/**
 * Get all members for the current subject.
 */
members.get('/', {
	tags: [ 'Member' ]
}, function(req, res) {
	ModuleSubjectMemberController.list(_helpers.sendResult(res), req.user, req.subject, req.query);
});

/**
 * Get one member for the current subject.
 */
members.get('/:memberId', {
	tags: [ 'Member' ]
}, function(req, res) {
	ModuleSubjectMemberController.read(_helpers.sendResult(res), req.user, req.subject, req.params.memberId);
});

/**
 * Update one member for the current subject.
 */
members.put('/:memberId', {
	tags: [ 'Member' ]
}, function(req, res) {
	ModuleSubjectMemberController.update(_helpers.sendResult(res), req.user, req.subject, req.params.memberId, req.body);
});

/**
 * Add a member to the current subject.
 */
members.post('/', {
	tags: [ 'Member' ]
}, function(req, res) {
	ModuleSubjectMemberController.create(_helpers.sendResult(res), req.user, req.subject, req.body);
});

/**
 * Remove a member from the current subject.
 */
members.delete('/:memberId', {
	tags: [ 'Member' ]
}, function(req, res) {
	ModuleSubjectMemberController.delete(_helpers.sendResult(res), req.user, req.subject, req.params.memberId);
});

/**
 * Register subresources for members.
 */
members.use('/:memberId/evaluations', require('./evaluations'));
members.use('/:memberId/comments', require('./comments'));

module.exports = members;
