/* global angular, alert */

angular.module('levelPad').controller('AdminStudentController', ['$scope', '$log', '$resource', function ($scope, $log, $resource) {
	'use strict';

	var Student = $resource('/api/students');


	$scope.update = function() {
		$scope.students = Student.query(function() {
		}, function() {
			alert('Es ist ein Fehler während des Laden aufgetreten.');
		});
	};
	$scope.update();

}]);
