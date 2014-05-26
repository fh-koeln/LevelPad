var express = require('express');
var api = express.Router();

/* GET home page. */
api.get('*', function(req, res) {
	res.sendfile('index.html', { root: __dirname + '/../../public' });
});

module.exports = api;
