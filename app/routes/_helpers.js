
module.exports = {
	sendResult: function(res) {
		return function(err, response) {
			if (err) {
				console.error(err);

				if (err.name === 'ValidationError') {
					res.status(400).json(err);
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
