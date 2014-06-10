/* global angular, alert */

angular.module('levelPad').controller('SubjectsController', ['$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', function ($scope, $routeParams, $location, $log, Module, Subject) {
	'use strict';

	console.log('SubjectsController: routeParams:', $routeParams);

	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.update = function() {
		Module.get({
			module: $routeParams.module
		}, function(module) {
			$scope.module = module;
		}, function() {
			alert('Could not load module.');
		});

		Subject.get({
			module: $routeParams.module,
			subject: $routeParams.subject
		}, function(subject) {
			$scope.subject = subject;
		}, function() {
			alert('Could not load subject.');
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
