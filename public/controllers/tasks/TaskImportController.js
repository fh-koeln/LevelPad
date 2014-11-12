/* global angular, alert */

angular.module('levelPad').controller('TaskImportController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'CurrentModule', 'CurrentSubject', 'CurrentTask',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, CurrentModule, CurrentSubject, CurrentTask) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
        $scope.task = CurrentTask;

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.update = function() {
			$scope.modules = Module.query(function() {

			}, function() {
				alert('Could not load modules.');
			});
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