var express = require('express');
var index = express.Router();

/* GET home page. */
index.get('*', function(req, res) {
	res.sendfile('index.html', { root: __dirname + '/../../public' });
});

module.exports = index;
