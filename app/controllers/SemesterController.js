
/**
 * Get all available semester
 */
exports.getAll = function (req, res) {
	res.json(200, [
		// TODO externalize this later
		{ id: 'sose', slug: 'sose', name: 'Sommersemester' },
		{ id: 'wise', slug: 'wise', name: 'Wintersemester' }
	]);
};
