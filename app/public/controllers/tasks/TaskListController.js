/* global angular, alert */

angular.module('levelPad').controller('TaskListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject) {

	'use strict';
	$scope.module = CurrentModule;
	$scope.subject = CurrentSubject;

	$scope.openTasks = function(module, subject) {
		if (module && subject) {
			$location.path('/' + subject.module.slug + '/' + subject.slug + '/tasks');
		} else {
			$log.warn('Could not open tasks because module or slug are undefined!');
		}
	};

	$scope.openTask = function(task) {
		$location.path('/' + task.subject.module.slug + '/' + task.subject.slug + '/tasks/' + task.slug);
	};

	$scope.openTeams = function(subject) {
		$location.path('/' + subject.module.slug + '/' + subject.slug + '/teams');
	};

	$scope.openStudents = function(subject) {
		$location.path('/' + subject.module.slug + '/' + subject.slug + '/students');
	};

	$scope.openSettings = function(subject) {
		$location.path('/' + subject.module.slug + '/' + subject.slug + '/settings');
	};

	$scope.update = function() {

	};
	$scope.update();

	$scope.tasks = [
		{
			title: 'Hallo'
		}
	];

	$scope.levels = [
		{
			title: 'Hallo'
		}
	];
}]);
