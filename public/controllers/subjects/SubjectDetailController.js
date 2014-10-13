/* global angular, alert */

angular.module('levelPad').controller('SubjectDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;




		$scope.assistants = [
			{ name: 'Volker '}
		];

}]);
