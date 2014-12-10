/* global angular, alert */

angular.module('levelPad').controller('EvaluationDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'Evaluation', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, Evaluation, DialogService, CurrentModule, CurrentSubject, CurrentTask ) {
		
		'use strict';
		
		$scope.subject = $routeParams.subject;
		$scope.module = $routeParams.module;
		$scope.task = $routeParams.task;
		$scope.evaluation = new Evaluation();
		$scope.showComments = 0;
		
		function objectFindByKey(array, key, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][key] === value) {
					return array[i];
				}
			}
			return null;
		}
		
		$scope.update = function () {
			if ($routeParams.task) {
				$scope.task = Task.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: $routeParams.task
				}, function(){
						if ($routeParams.member) {
							$scope.evaluations = Evaluation.query({
								module: $routeParams.module,
								subject: $routeParams.subject,
								member: $routeParams.member
							},function(){
								var evaluation = objectFindByKey($scope.evaluations, 'task', $scope.task._id);
								if (evaluation){
									$scope.evaluation = evaluation;

								};	
							})
						};
				})};
			
			
		};
		
		$scope.update();
		
		$scope._save = function() {
			$scope.evaluation.task = $scope.task._id;
			return $scope.evaluation.$save({
				module: $routeParams.module,
				subject: $routeParams.subject,
				member: $routeParams.member,
			});
		};
		
		$scope.save = $scope._save;
	
	}]);
