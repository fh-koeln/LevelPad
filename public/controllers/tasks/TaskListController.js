/* global angular, alert */

angular.module('levelPad').controller('TaskListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, CurrentTask, ChartOption) {

	'use strict';
	$scope.module = CurrentModule;
	$scope.subject = CurrentSubject;
    $scope.task = CurrentTask;

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

	$scope.showEditDialog = function(task) {
		$scope.task = angular.copy(task);
		$('#edit').modal();
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

	$scope.showDeleteDialog = function(task) {
		$scope.task = angular.copy(task);
		$('#delete').modal();
	};    
        
	$scope.task = [
		{
			title: 'Hallo'
		}
	];

	$scope.levels = [
		{
			title: 'Hallo'
		}
	];
		
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
