
module.exports = {
	sendResult: function(res) {
		return function(err, response) {
			if (err) {
				console.error(err);
				res.json(500, err);
			} else {
				res.json(200, response);
			}
		};
	}
};
