
var express = require('express'),
	years = express.Router(),
	YearController = require('../controllers/YearController'),
	_helpers = require('../controllers/_helpers');

years.get('/', function (req, res) {
	YearController.getAll(_helpers.sendResult(res));
});

module.exports = years;
