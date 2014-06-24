/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject) {
	'use strict';
	$scope.module = CurrentModule;
	$scope.subject = CurrentSubject;

	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.update = function() {

	};
	$scope.update();

}]);
