var express = require('express'),
	users = express.Router();

users.param('user_id', function(req, res, next, userId) {
    // sample user, would actually fetch from DB, etc...
    req.user = {
        id: userId,
        name: 'TJ'
    };
    next();
});

users.get('/', function(req, res, next) {
	res.send('user index');
});

users.post('/', function(req, res, next) {
	res.send('create user');
});

users.get('/:user_id', function(req, res, next) {
	res.send('update user ' + req.user.id);
});

users.put('/:user_id', function(req, res, next) {
	res.send('update user ' + req.params.user);
});

users.delete('/:user_id', function(req, res, next) {
	res.send('destroy user ' + req.params.user);
});

module.exports = users;
