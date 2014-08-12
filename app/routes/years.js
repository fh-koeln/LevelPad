
var express = require('express'),
	years = express.Router(),
	YearController = require('../controllers/YearController'),
	_helpers = require('./_helpers');

years.get('/', function (req, res) {
	YearController.list(_helpers.sendResult(res));
});

module.exports = years;
