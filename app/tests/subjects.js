'use strict';

var modules = require('./modules'),
	subjects = {};

subjects.wba1Wise1415 = {
	slug: 'wise1415',
	semester: 'Wintersemester',
	year: 2014,
	module: modules.wba1,
	status: 'active'
};

subjects.wba2Sose14 = {
	slug: 'sose14',
	semester: 'Sommersemester',
	year: 2014,
	module: modules.wba2,
	status: 'inactive'
};

subjects.eisSose13 = {
	slug: 'sose13',
	semester: 'Sommersemester',
	year: 2013,
	module: modules.eis,
	status: 'inactive'
};

module.exports = subjects;
