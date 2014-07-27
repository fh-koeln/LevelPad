
/**
 * Get all available years
 */
exports.getAll = function (callback) {
	callback(null, [
		// TODO automatically load this: from first used year to current year (+1 ?)
		{ id: '0x7DD', slug: '2013', year: 2013 },
		{ id: '0x7DE', slug: '2014', year: 2014 },
		{ id: '0x7DF', slug: '2015', year: 2015 }
	]);
};
