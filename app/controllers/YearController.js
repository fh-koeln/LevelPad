'use strict';

var Subject = require('../models/Subject');

/**
 * List all years
 */
exports.list = function (callback) {

	Subject.findOne().lean().select('year').sort('year').exec(function(err, firstYearSubject) {
		if (err) {
			callback(err);
			return;
		}

		var from = firstYearSubject ? firstYearSubject.year : new Date().getFullYear(),
			to = new Date().getFullYear() + 2,
			years = [];

		if (from > to) {
			from = to;
		}

		for (var year = from; year <= to; year++) {
			years.push({
				slug: year.toString(),
				name: year.toString(),
				year: year
			});
		}

		callback(null, years);
	});
};
