'use strict';

var express = require('express'),
	api = express.Router(),
	acl = require('../config/acl');

// API is only available for authenticated users.
api.use(acl.middleware);

api.use('/modules', require('../app/routes/modules'));
api.use('/subjects', require('../app/routes/subjects'));
api.use('/users', require('../app/routes/users'));
api.use('/years', require('../app/routes/years'));
api.use('/semesters', require('../app/routes/semesters'));

var routes = express.Router();
routes.use('/api', api);
//routes.get('/explorer', require('../resources/explorer')('', routes));

if (process.env.NODE_ENV === 'development') {
	routes.use('/acl', acl.debugRoute);
}

routes.get('/*', function(req, res) {
	if (req.path.indexOf('/views/') === 0) {
		res.send(200, 'Illegal path: ' + req.path);
	} else {
		res.sendfile('index.html', { root: __dirname + '/../public' });
	}
});

module.exports = routes;
