/* global angular, alert */

angular.module('levelPad').controller('TaskDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Task', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Task, CurrentModule, CurrentSubject, CurrentTask, ChartOption) {

		'use strict';
		$scope.newValue = 0;
		$scope.subject = $routeParams.subject;
		$scope.module = $routeParams.module;

		$scope.update = function() {
			if(!$scope.usedPercent){
				$scope.usedPercent = 0;
				Task.query({ module: $routeParams.module, subject: $routeParams.subject }, function(tasks) {
					angular.forEach(tasks, function(task) {
						$scope.usedPercent += task.weight;
					});
					prepareTask();
			}, function() {
				alert('Could not load tasks.');
			});
			}
			if ($routeParams.task) {
				$scope.task = Task.get({
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

			$scope.task._currentTaskData = [
				{
					title:'Learning Outcome',
					value: $scope.task.weight,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: 100 - $scope.task.weight,
					color:'lightgray',
					highlight: 'lightgray'
				},
			];
		}

		$scope._save = function () {
			return $scope.task.$save({ module: $routeParams.module, subject: $routeParams.subject });
		};

		$scope._delete = function () {
			return $scope.task.$delete({ module: $scope.subject.module.slug });
		};

		$scope.showEditDialog = function() {
			var dialog = new DialogService('/:module/:subject/tasks/:task/edit');

			dialog.scope.usedPercent = $scope.usedPercent - $scope.task.weight;

			dialog.scope.submit = function() {
				var self = this;
				this._save().then(function() {
					$scope.usedPercent = self.usedPercent + self.task.weight;
					$scope.update();
					dialog.submit();
				}, function() {
					alert('Fehler!');
				});
			};
			dialog.scope.showConfirmDeleteDialog = function() {
				dialog.cancel();
				this.showDeleteDialog();
			};
			dialog.open();
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
