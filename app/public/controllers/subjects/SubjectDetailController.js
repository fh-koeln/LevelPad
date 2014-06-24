/* global angular, alert */

angular.module('levelPad').controller('SubjectDetailController', ['$scope', 'Module', 'Subject', function ($scope, Module, Subject) {
	'use strict';

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

}]);
