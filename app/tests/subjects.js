'use strict';

var modules = require('./modules'),
	subjects = {};

subjects.wba1Wise1415 = {
	slug: 'wise1415',
	semester: 'Wintersemester',
	year: 2014,
	module: modules.wba1,
	status: 'active',
	tasks: [
		{
			title: 'Dies ist der Titel der Aufgabe 1',
			description: 'Dies ist die Beschreibung der Aufgabe 1',
			slug: 'dies-ist-der-titel-der-aufgabe-1',
			weight: 25
		},
		{
			title: 'Dies ist der Titel der Aufgabe 2',
			description: 'Dies ist die Beschreibung der Aufgabe 2',
			slug: 'dies-ist-der-titel-der-aufgabe-2',
			weight: 25
		},
		{
			title: 'Dies ist der Titel der Aufgabe 3',
			description: 'Dies ist die Beschreibung der Aufgabe 3',
			slug: 'dies-ist-der-titel-der-aufgabe-3',
			weight: 50
		}
	],
	members: [

	]
};

subjects.wba1Wise1516 = {
	slug: 'wise1516',
	semester: 'Wintersemester',
	year: 2015,
	module: modules.wba1,
	status: 'inactive'
};

subjects.cgaWise1415 = {
	slug: 'wise1415',
	semester: 'Wintersemester',
	year: 2014,
	module: modules.cga,
	status: 'inactive'
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

subjects.wba2Sose13 = {
	slug: 'sose13',
	semester: 'Sommersemester',
	year: 2013,
	module: modules.wba2,
	status: 'inactive'
};

module.exports = subjects;
