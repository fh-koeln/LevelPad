'use strict';

var debug = require('debug')('API Helper');

module.exports = {
	sendResult: function(res) {
		return function(err, response) {
			if (err) {
				debug(err);
				debug(err.message);

				if (err.name === 'ValidationError' || err.name === 'AlreadyInUseError' || err.name === 'ArgumentNullError' || err.name === 'TypeError') {
					res.status(400).json(err);
				} else if (err.name === 'AuthenticationRequiredError') {
					res.status(403).json(err);
				} else if (err.name === 'NotFoundError') {
					res.status(404).json(err);
				} else {
					res.status(500).json(err);
				}
			} else if (!response) {
				res.status(404).end();
			} else {
				res.status(200).json(response);
			}
		};
	}
};
