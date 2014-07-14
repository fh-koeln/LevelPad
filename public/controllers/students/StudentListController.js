/* global angular, alert */

angular.module('levelPad').controller('StudentListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;

	$scope.update = function() {
//		$scope.students = Student.query(function() {
//		}, function() {
//			alert('Es ist ein Fehler während des Laden aufgetreten.');
//		});
	};
	$scope.update();

	$scope.students = [
		{ name: 'Dominik' },
		{ name: 'Dennis '},
		{ name: 'Ben'},
		{ name: 'Dario'}
	];

}]);
