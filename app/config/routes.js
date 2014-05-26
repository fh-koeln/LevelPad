'use strict';

var express = require('express');

var isAuthenticated = function(req, res, next) {
	if (req.path == '/login')
		return next();

	//return next(); // @todo remove
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
};

var api = express.Router();
api.use('/subjects', require('../resources/Subjects'));
api.use('/users', require('../resources/Users'));
api.use('/account', require('../resources/Account'));

var routes = express.Router();
//routes.use(isAuthenticated);
routes.use('/api', api);

/* GET home page for. */
routes.get('/*', function(req, res) {
    res.sendfile('index.html', { root: __dirname + '/../public' });
});

module.exports = routes;
