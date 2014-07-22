'use strict';

var express = require('express'),
	api = express.Router(),
	acl = require('../config/acl');

// API is only available for authenticated users.
api.use(acl.middleware);

api.use('/modules', require('../app/resources/modules'));
api.use('/subjects', require('../app/resources/subjects'));
api.use('/users', require('../app/resources/users'));
api.use('/years', require('../app/resources/years'));
api.use('/semester', require('../app/resources/semester'));

var routes = express.Router();
routes.use('/api', api);
//routes.get('/explorer', require('../resources/explorer')('', routes));

if (process.env.NODE_ENV === 'development') {
	routes.use('/acl', acl.debugRoute);
}

routes.get('/*', function(req, res) {
	console.log(req.path);
	if (req.path.indexOf('/views/') === 0) {
		res.send(200, 'Illegal path: ' + req.path);
	} else {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	}
});

module.exports = routes;
