
/**
 * Get all available semester
 */
exports.getAll = function(callback) {
	callback(null, [
		// TODO externalize this later
		{ id: 'sose', slug: 'sose', name: 'Sommersemester' },
		{ id: 'wise', slug: 'wise', name: 'Wintersemester' }
	]);
};
