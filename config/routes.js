'use strict';

var express = require('express'),
	swag = require('bo-swag'),
	api = swag.router(express.Router()),
	acl = require('../config/acl');

// API is only available for authenticated users.
if (process.env.ACL === 'disabled') {
	console.log('ACL DISABLED!');
} else {
	api.use(acl.middleware);
}

// Primary resources
api.use('/modules', require('../app/routes/modules'));
api.use('/users', require('../app/routes/users'));
//api.use('/subjects', require('../app/routes/subjects')); // Currently disabled because it's unused

// Secondary resources
api.use('/years', require('../app/routes/years'));
api.use('/semesters', require('../app/routes/semesters'));

var routes = express.Router();
routes.use('/api', api);

var spec = swag.spec();
spec.setTitle('LevelPad');
spec.addDefinition('Error', {
	properties: {}
});
routes.use('/explorer', swag.swaggerUI(spec, { basePath: '/api' }, api));

if (process.env.NODE_ENV === 'development') {
	routes.use('/acl', acl.debugRoute);
}

routes.get('/*', function(req, res) {
	if (req.path.indexOf('/views/') === 0) {
		res.send(200, 'Illegal path: ' + req.path);
	} else {
		var role = 'public',
			username = '';
		if (req.user) {
			role = req.user.role;
			username = req.user.username;
		}
		res.cookie('user', JSON.stringify({
			'username': username,
			'role': role
		}));
		res.sendFile('_index.html', { root: __dirname + '/../public' });
	}
});

module.exports = routes;
