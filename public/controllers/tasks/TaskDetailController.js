/* global angular */

angular.module('levelPad').controller('TaskDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Task', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Task, CurrentModule, CurrentSubject, CurrentTask, ChartOption) {

		'use strict';
		$scope.usedPercent = 0;
		
		$scope.update = function() {
			Task.query({ module: $routeParams.module, subject: $routeParams.subject }, function(tasks) {
				angular.forEach(tasks, function(task) {
					$scope.usedPercent += task.weight;
				});
				prepareTask();
			}, function() {
				alert('Could not load tasks.');
			});
			if ($routeParams.task) {
				$scope.task = Subject.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: $routeParams.task
				}, function () { 
					prepareTask();
				});
			} else {
				$scope.task = new Task();
				$scope.task.weight = 0;
				prepareTask();
			}
		};
		$scope.update();

		function prepareTask() {
			$scope.task._chartData = [
				  {
					title:'Learning Outcome',
					value: $scope.task.weight,
					color: '#77cc00',
					highlight: '#88dd11'
				  	},
				  	{
					title:'Rest',
					value: 100 - $scope.task.weight - $scope.usedPercent,
					color:'lightgray',
					highlight: 'lightgray'
				  	},
					{
					title:'Belegt',
					value: $scope.usedPercent,
					color:'#EE497A',
					highlight: '#F3537F'
					}
				];
		}
		
		$scope._save = function () {
			return $scope.task.$save({ module: $routeParams.module, subject: $routeParams.subject });
		};

		$scope._delete = function () {
			return $scope.task.$delete({ module: $scope.subject.module.slug });
		};

		//Pie Chart Magic
		$scope.options = ChartOption;

		$scope.$watch(
			function( $scope ) {
				return( $scope.task.weight );
			},
			function( newValue ) {
				newValue = parseInt(newValue, 10);
				$scope.task._chartData = [
				  	{
					title:'Learning Outcome',
					value: newValue,
					color: '#77cc00',
					highlight: '#88dd11'
				  	},
				  	{
					title:'Rest',
					value: 100 - newValue - $scope.usedPercent,
					color:'lightgray',
					highlight: 'lightgray'
				  	},
					{
					title:'Belegt',
					value: $scope.usedPercent,
					color:'#EE497A',
					highlight: '#F3537F'
					}
				];
			}
		);
	}]);
