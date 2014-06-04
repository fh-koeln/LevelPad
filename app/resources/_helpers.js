
module.exports = {
	sendResult: function(res) {
		return function(err, response) {
			if (err) {
				console.error(err);
				res.json(500, err);
			} else {
				console.log(res.json);
				//res.json(200, response);
				res.status(200).json(response)
			}
		};
	}
};
