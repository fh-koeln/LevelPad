/* global angular, alert */

angular.module('levelPad').controller('TaskListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, ChartOption) {

	'use strict';
	$scope.subject = $scope.subject || CurrentSubject || new Subject();

	$scope.update = function() {
		$scope.tasks = [];
		// Get all subjects for the current module
		Task.query({ module: $routeParams.module, subject: $routeParams.subject }, function(tasks) {
			angular.forEach(tasks, function(task) {
				$scope.tasks.push(task);
			});
		}, function() {
			alert('Could not load tasks.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/tasks/new');
		dialog.scope.task = new Task();
		dialog.scope.submit = function() {
			dialog.scope.task.$save(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};

	$scope.showImportDialog = function() {
		var dialog = new DialogService('/tasks/import');
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


	//Pie Chart Magic
	$scope.options = ChartOption;
	// Chart.js Data
	$scope.data = [
	  {
		title:'Learning Outcome',
		value: 20,
		color: '#77cc00',
		highlight: '#88dd11'
	  },
	  {
		title:'Rest',
		value: 100-20,
		color:'lightgray',
		highlight: 'lightgray'
	  }
	];
}]);
