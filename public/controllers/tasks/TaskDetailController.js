/* global angular, alert */

angular.module('levelPad').controller('TaskDetailController', [
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

        $scope.showCreateDialog = function() {
			var dialog = new DialogService('/tasks/new');
			dialog.scope.task = new Task();
			dialog.scope.submit = function() {
				dialog.scope.module.$save(function() {
					dialog.submit();
					$scope.update();
				}, function() {
					alert('Fehler!');
				});
			};
			dialog.open();
		};
        
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
