'use strict';

var users = {};

users.admin1 = {
	username: 'admin1',
	password : 'unused',
	firstname: 'Max',
	lastname: 'Mustermann',
	email: 'max.mustermann@fh-koeln.de',
	role: 'administrator'
};

users.lecturer1 = {
	username: 'lecturer1',
	password : 'unused',
	firstname: 'Erika',
	lastname: 'Mustermann',
	email: 'erika.mustermann@fh-koeln.de',
	role: 'lecturer'
};

users.assistant1 = {
	username: 'assistant1',
	password : 'unused',
	firstname: 'Roberto',
	lastname: 'Jacinto',
	email: 'roberto.jacinto@fh-koeln.de',
	role: 'assistant'
};

users.student1 = {
	username: 'student1',
	password : 'unused',
	firstname: 'Manuel',
	lastname: 'Manoli',
	email: 'manuel.manoli@fh-koeln.de',
	studentNumber: '11111111',
	role: 'student'
};

users.student2 = {
	username: 'student2',
	password : 'unused',
	firstname: 'Laura',
	lastname: 'Mueller',
	email: 'laura.mueller@fh-koeln.de',
	studentNumber: '12345678',
	role: 'student'
};

users.student3 = {
	username : 'pmeyer',
	password : 'unused',
	firstname : 'Peter',
	lastname : 'Meyer',
	email: 'peter.meyer@fh-koeln.de',
	studentNumber: '10892712',
	role: 'student'
};


module.exports = users;
