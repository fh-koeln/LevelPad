/* global angular */

angular.module('levelPad').controller('TaskDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Task', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Task, CurrentModule, CurrentSubject, CurrentTask, ChartOption) {

		'use strict';

		$scope.update = function() {
			if ($routeParams.task) {
				$scope.task = Subject.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: $routeParams.task
				});
			} else {
				$scope.task = new Task();
			}
		};
		$scope.update();

		$scope._save = function () {
			return $scope.task.$save({ module: $routeParams.module, subject: $routeParams.subject });
		};

		$scope._delete = function () {
			return $scope.task.$delete({ module: $scope.subject.module.slug });
		};

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
