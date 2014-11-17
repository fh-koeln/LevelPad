'use strict';

/**
 * List all semester
 */
exports.list = function(callback) {
	callback(null, [
		// TODO externalize this later
		{ slug: 'sose', name: 'Sommersemester' },
		{ slug: 'wise', name: 'Wintersemester' }
	]);
};
