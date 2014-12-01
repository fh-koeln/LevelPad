/* global angular, alert */

angular.module('levelPad').controller('TaskDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, CurrentModule, CurrentSubject, CurrentTask, ChartOption) {

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
		
		//Pie Chart Magic
		$scope.options = ChartOption;
		$scope.task ={
			amountRange: 50,
			belegt : 15
		};
		
		$scope.$watch(
			function( $scope ) {
				return( $scope.task.amountRange );
			},
			function( newValue ) {
				newValue = parseInt(newValue, 10);
				$scope.data = [
				  	{
					title:'Learning Outcome',
					value: newValue,
					color: '#77cc00',
					highlight: '#88dd11'
				  	},
				  	{
					title:'Rest',
					value: 100 - newValue - 15,
					color:'lightgray',
					highlight: 'lightgray'
				  	},
					{
					title:'Belegt',
					value: 15,
					color:'#EE497A',
					highlight: '#F3537F'
					}
				];
			}
		);
	}]);
