var express = require('express'),
	users = express.Router();

users.get('/', function(req, res, next) {
	res.send('user index');
});

users.post('/', function(req, res, next) {
	res.send('create user');
});

users.get('/:id', function(req, res, next) {
	res.send('update user ' + req.params.user);
});

users.put('/:id', function(req, res, next) {
	res.send('update user ' + req.params.user);
});

users.delete('/:id', function(req, res, next) {
	res.send('destroy user ' + req.params.user);
});

module.exports.users = users;
