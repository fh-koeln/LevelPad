'use strict';

var express = require('express'),
	api = express.Router(),
	acl = require('../config/acl');

// API is only available for authenticated users.
api.use(acl.middleware);

api.use('/modules', require('../app/resources/modules'));
api.use('/subjects', require('../app/resources/subjects'));
api.use('/users', require('../app/resources/users'));

var routes = express.Router();
routes.use('/api', api);
//routes.get('/explorer', require('../resources/explorer')('', routes));

routes.get('/*', function(req, res) {
	console.log(req.path);
	if (req.path.indexOf('/views/') === 0) {
		res.send(200, 'Illegal path: ' + req.path);
	} else {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	}
});

module.exports = routes;
