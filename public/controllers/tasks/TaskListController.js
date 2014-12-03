/* global angular, alert */

angular.module('levelPad').controller('TaskListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, ChartOption) {

	'use strict';

	$scope.subject = $routeParams.subject;
	$scope.module = $routeParams.module;
		
	$scope.update = function() {
		$scope.tasks = [];
		Task.query({ module: $routeParams.module, subject: $routeParams.subject }, function(tasks) {
			angular.forEach(tasks, function(task) {
				$scope.tasks.push(prepareTask(task));
			});
		}, function() {
			alert('Could not load tasks.');
		});
	};
		
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/:module/:subject/tasks/new');
		dialog.scope.submit = function() {
			this._save().then(function() {
				$scope.update();
				dialog.submit();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};

	/*$scope.showImportDialog = function() {
		var dialog = new DialogService('/:module/:subject/tasks/import');
		dialog.scope.submit = function() {
			this._save().then(function() {
				$scope.update();
				dialog.submit();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};*/


	//Pie Chart Magic
	$scope.options = ChartOption;
	// Chart.js Data
	function prepareTask(task) {
			task._chartData = [
				  {
					title:'Learning Outcome',
					value: task.weight,
					color: '#77cc00',
					highlight: '#88dd11'
				  },
				  {
					title:'Rest',
					value: 100 - task.weight,
					color:'lightgray',
					highlight: 'lightgray'
				  }
				];
		return task;
	}
}]);
