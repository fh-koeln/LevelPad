
var express = require('express'),
	swag = require('bo-swag'),
	years = swag.router(express.Router()),
	YearController = require('../controllers/YearController'),
	_helpers = require('./_helpers');

years.get('/', {

}, function (req, res) {
	YearController.list(_helpers.sendResult(res));
});

module.exports = years;
