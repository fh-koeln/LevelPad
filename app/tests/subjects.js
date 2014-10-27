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

module.exports = subjects;
