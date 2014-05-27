'use strict';

var express = require('express');
var api = express.Router();

api.use('/modules', require('../resources/Modules'));
api.use('/subjects', require('../resources/Subjects'));
api.use('/users', require('../resources/Users'));

var routes = express.Router();
routes.use('/api', api);

/* GET home page for. */
routes.get('/*', function(req, res) {
    res.sendfile('index.html', { root: __dirname + '/../public' });
});

module.exports = routes;
