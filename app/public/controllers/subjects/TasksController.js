/* global angular, alert */

angular.module('levelPad').controller('TasksController', ['$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', function ($scope, $routeParams, $location, $log, Module, Subject) {
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

	$scope.levels = [
		{
			title: 'Hallo'
		}
	];
}]);
