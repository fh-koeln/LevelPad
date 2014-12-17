'use strict';

/**
 * RESTful API for comments.
 */

var express = require('express'),
	swag = require('bo-swag'),
	comments = swag.router(express.Router()),
	ModuleSubjectMemberCommentController = require('../controllers/ModuleSubjectMemberCommentController'),
	_helpers = require('./_helpers');

/**
 * Get all comments for the current member.
 */
comments.get('/', {
	tags: [ 'Comment' ]
}, function(req, res) {
	ModuleSubjectMemberCommentController.list(_helpers.sendResult(res), req.user, req.member);
});

/**
 * Get one comment of the current member.
 */
comments.get('/:commentId', {
	tags: [ 'Comment' ]
}, function(req, res) {
	ModuleSubjectMemberCommentController.read(_helpers.sendResult(res), req.user, req.member, req.params.commentId);
});

/**
 * Update one comment of the current member.
 */
comments.put('/:commentId', {
	tags: [ 'Comment' ]
}, function(req, res) {
	ModuleSubjectMemberCommentController.update(_helpers.sendResult(res), req.user, req.member, req.params.commentId, req.body);
});

/**
 * Add an comment to the current member.
 */
comments.post('/', {
	tags: [ 'Comment' ]
}, function(req, res) {
	req.body.createdBy = req.user._id;
	ModuleSubjectMemberCommentController.create(_helpers.sendResult(res), req.user, req.member, req.body);
});

/**
 * Remove an comment from the current member.
 */
comments.delete('/:commentId', {
	tags: [ 'Comment' ]
}, function(req, res) {
	ModuleSubjectMemberCommentController.delete(_helpers.sendResult(res), req.user, req.member, req.params.commentId);
});

module.exports = comments;
