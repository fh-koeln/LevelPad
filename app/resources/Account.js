var express = require('express'),
	account = express.Router(),
	User = require('../models/User.js');

account.get('/', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.json(401, { error: 'Not Authenticated!' });
	}

	res.json(req.user);
});

account.post('/', function(req, res) {
	if (req.isAuthenticated()) {
		return res.json(400, { error: 'Already Authenticated!' });
	}

	var password = req.body.password;

	delete req.body.password;
	var user = new User(req.body);
	user.save(function(err, user) {
		if (err) {
			res.send(500, { error: err });
		} else {
			res.send(200, user);
		}
	});
});

account.delete('/', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.json(401, { error: 'Not Authenticated!' });
	}

	res.send('destroy account ' + req.params.artifact);
});

module.exports = account;
