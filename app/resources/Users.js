exports.index = function(req, res){
	res.send('user index');
};

exports.create = function(req, res){
	res.send('create user');
};

exports.show = function(req, res){
	res.send('show user ' + req.params.user);
};

exports.update = function(req, res){
	res.send('update user ' + req.params.user);
};

exports.destroy = function(req, res){
	res.send('destroy user ' + req.params.user);
};

var express = require('express');
var users = express.Router();

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
