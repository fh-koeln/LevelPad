/* global angular, alert */

angular.module('levelPad').controller('TeamListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject) {
		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;

		console.log('Current module', CurrentModule);
		console.log('Current subject', CurrentSubject);

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.update = function() {

		};
		$scope.update();

		$scope.teams = [
			{
				students: [
					{ name: 'Dominik' },
					{ name: 'Dennis' }
				]
			},
			{
				students: [
					{ name: 'Ben'},
					{ name: 'Dario'}
				]
			}
		];

	}]);
