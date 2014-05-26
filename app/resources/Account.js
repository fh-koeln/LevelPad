var express = require('express'),
	account = express.Router();

account.get('/', function(req, res, next) {
	res.json(req.user);
});

account.get('/edit', function(req, res, next) {
	res.send('update account ' + req.params.artifact);
});

account.put('/', function(req, res, next) {
	res.send('update account ' + req.params.artifact);
});

account.delete('/', function(req, res, next) {
	res.send('destroy account ' + req.params.artifact);
});

module.exports = account;
