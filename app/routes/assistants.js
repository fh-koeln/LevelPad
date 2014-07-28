
var express = require('express'),
	assistants = express.Router(),
	Module = require('../models/Module'),
	Subject = require('../models/Subject'),
	Member = require('../models/Member'),
	User = require('../models/User'),
	helpers = require('./_helpers');

assistants.param('assistant', function(req, res, next, subject, assistant) {
	console.log('get assistant param');
	console.log(subject);
	console.log(assistant);
	Member.findBySubjectAndId(subject, assistant, function(err, member) {
		console.log('find result');
		console.log(member);
		req.member = member;
		next();
	});
});

/**
 * Get all assistants for the current subject.
 */
assistants.get('/', function(req, res) {
	Member.find(helpers.sendResult(res));
});

/**
 * Get one assstant for the current subject.
 */
assistants.get('/:slug', function(req, res) {
	Member.findOne({
//		user: user,
//		subject: subject
	}, helpers.sendResult(res));
});

/**
 * Add a assistant to the current subject.
 */
assistants.post('/', function(req, res) {
	req.body.slug = (req.body.shortName).replace(/[^A-Za-z0-9]/, '').toLowerCase();

	new Module(req.body).save(helpers.sendResult(res));
});

/**
 * Remove a assistant from the current subject.
 */
assistants.delete('/:slug', function(req, res) {
	Module.findOneAndRemove(req.params, helpers.sendResult(res));
});

module.exports = assistants;
