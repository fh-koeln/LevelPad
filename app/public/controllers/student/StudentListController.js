/* global angular, alert */

angular.module('levelPad').controller('AdminStudentController', ['$scope', '$log', 'Student', function ($scope, $log, Student) {
	'use strict';

	$scope.update = function() {
		$scope.students = Student.query(function() {
		}, function() {
			alert('Es ist ein Fehler während des Laden aufgetreten.');
		});
	};
	$scope.update();

	$scope.students = [
		{ name: 'Dominik' },
		{ name: 'Dennis '},
		{ name: 'Ben'},
		{ name: 'Dario'}
	];

}]);
