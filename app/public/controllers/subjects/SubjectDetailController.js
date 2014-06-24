/* global angular, alert */

angular.module('levelPad').controller('SubjectDetailController', ['$scope', 'CurrentModule', 'CurrentSubject', function ($scope, CurrentModule, CurrentSubject) {
	'use strict';

	$scope.module = CurrentModule;
	$scope.subject = CurrentSubject;

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
		});

		$scope.subjects = Subject.query(function() {

		}, function() {
			alert('Could not load subjects.');
		});
	};
	$scope.update();

	$scope.assistants = [
		{ name: 'Volker '}
	];

}]);
