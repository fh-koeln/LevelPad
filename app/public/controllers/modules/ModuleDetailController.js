/* global angular, alert */

angular.module('levelPad').controller('ModuleDetailController', ['$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', function ($scope, $routeParams, $location, $log, Module, Subject) {
	'use strict';

	console.log('ModuleDetailController: routeParams:', $routeParams);

	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.update = function() {
		Module.get({
			module: $routeParams.module
		}, function(module) {
			$scope.module = module;
		}, function() {
			alert('Could not load subjects.');
		});

		Subject.query({
			module: $routeParams.module
		}, function(subjects) {
			$scope.subjects = subjects;
			$scope.subject = subjects[0];
		}, function() {
			alert('Could not load subjects.');
		});
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

	$scope.tasks = [
		{
			title: 'Hallo'
		}
	];

	$scope.students = [
		{ name: 'Dominik' },
		{ name: 'Dennis '},
		{ name: 'Ben'},
		{ name: 'Dario'}
	];

	$scope.assistants = [
		{ name: 'Volker '}
	];

}]);
