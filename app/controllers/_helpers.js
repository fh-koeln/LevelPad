
module.exports = {
	sendResult: function(res) {
		return function(err, response) {
			if (err) {
				console.error(err);
				res.json(500, err);
			} else if (!response) {
				res.status(404).end();
			} else {
				res.json(200, response);
			}
		};
	}
};
