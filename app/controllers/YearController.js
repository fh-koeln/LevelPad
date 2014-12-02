'use strict';

var Subject = require('../models/Subject');

/**
 * List all years
 */
exports.list = function (callback) {

	var thisYear = new Date().getFullYear();

	Subject.findOne().lean().select('year').sort('year').exec(function(err, firstYearSubject) {
		var from = thisYear, to = thisYear + 2, years = [];

		if (!err && firstYearSubject && firstYearSubject.year && firstYearSubject.year < from) {
			from = firstYearSubject.year;
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
