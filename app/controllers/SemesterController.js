
/**
 * List all semester
 */
exports.list = function(callback) {
	callback(null, [
		// TODO externalize this later
		{ id: 'sose', slug: 'sose', name: 'Sommersemester' },
		{ id: 'wise', slug: 'wise', name: 'Wintersemester' }
	]);
};
