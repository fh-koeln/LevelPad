
var express = require('express'),
	semester = express.Router();

/**
 * Get all available semester
 */
semester.get('/', function (req, res) {
	res.json(200, [
		// TODO externalize this later
		{ id: 'sose', slug: 'sose', name: 'Sommersemester' },
		{ id: 'wise', slug: 'wise', name: 'Wintersemester' }
	]);
});

module.exports = semester;
