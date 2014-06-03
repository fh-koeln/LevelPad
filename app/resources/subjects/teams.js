
var express = require('express'),
	teams = express.Router(),
	Team = require('../../models/Team'),
	helpers = require('../_helpers');

/**
 * Get all teams for the current subject.
 */
teams.get('/', function(req, res) {
	Team.find(helpers.sendResult(res));
});

/**
 * Get one team for the current subject..
 */
teams.get('/:slug', function(req, res) {
	Team.findOne(req.params, helpers.sendResult(res));
});

/**
 * Create a new team for the current subject.
 */
teams.post('/', function(req, res) {
	req.body.slug = (req.body.shortName).replace(/[^A-Za-z0-9]/, '').toLowerCase();

	new Team(req.body).save(helpers.sendResult(res));
});

/**
 * Update a team in the current subject..
 */
teams.put('/:slug', function(req, res) {
	// TODO: Verify that the ID and the slug is not changed!?
	req.body.slug = req.params.slug;

	Team.findOneAndUpdate(req.params, req.body, helpers.sendResult(res));
});

/**
 * Delete a team for the current subject..
 */
teams.delete('/:slug', function(req, res) {
	Team.findOneAndRemove(req.params, helpers.sendResult(res));
});

module.exports = teams;
