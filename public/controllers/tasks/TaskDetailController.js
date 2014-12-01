/* global angular, alert */

angular.module('levelPad').controller('TaskDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Task', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Task, CurrentModule, CurrentSubject, CurrentTask, ChartOption) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
        $scope.task = CurrentTask;

		$scope.update = function() {

		};

		$scope.update();

		if (!$scope.submit) {
			$scope.submit = function () {
				$scope.task.$save({ module: module.slug} , function() {
					$scope.update();
				}, function () {
					alert('Error!');
				});
			};
		}

		if (!$scope.delete) {
			$scope.delete = function () {
				$scope.task.$delete({ module: $scope.subject.module.slug }, function() {
					$scope.update();
				}, function () {
					alert('Error!');
				});
			};
		}

		//Pie Chart Magic
		$scope.options = ChartOption;
		$scope.task ={
			amountRange: 50
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
					value: 100 - newValue,
					color:'lightgray',
					highlight: 'lightgray'
				  }
				];
			}
		);
	}]);
