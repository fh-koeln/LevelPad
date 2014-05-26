var express = require('express');
var api = express.Router();

api.route('/users/*')
	.all(require('../../resources/Users').users);

module.exports = api;
