'use strict';

var express = require('express');

var api = express.Router();

api.use(function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.status(401);
	} else {
		next();
	}
});
api.use('/subjects', require('../resources/Subjects'));
api.use('/users', require('../resources/Users'));
api.use('/account', require('../resources/Account'));

var routes = express.Router();
routes.use('/api', api);

/* GET home page for. */
routes.get('/*', function(req, res) {
    res.sendfile('index.html', { root: __dirname + '/../public' });
});

module.exports = routes;
