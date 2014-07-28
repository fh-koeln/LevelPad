
module.exports = {
	sendResult: function(res) {
		return function(err, response) {
			if (err) {
				console.error(err);

				if (err.name === 'ValidationError') {
					res.json(400, err);
				} else {
					res.json(500, err);
				}
			} else if (!response) {
				res.status(404).end();
			} else {
				res.json(200, response);
			}
		};
	}
};
