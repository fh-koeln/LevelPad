/* global angular, alert */

angular.module('levelPad').controller('TaskListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, ChartOption) {

	'use strict';

	$scope.update = function() {
		$scope.tasks = [];
		Task.query({ module: $routeParams.module, subject: $routeParams.subject }, function(tasks) {
			$scope.tasks = tasks;
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
