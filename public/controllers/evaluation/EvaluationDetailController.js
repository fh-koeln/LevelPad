/* global angular, alert */

angular.module('levelPad').controller('EvaluationDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, CurrentTask ) {
		
		'use strict';
		
		$scope.subject = $routeParams.subject;
		$scope.module = $routeParams.module;
		$scope.showComments = 0;
		
		
		
		$scope.member = [
			{
			name: 'Peeta'
			}
		];
		
		$scope.update = function () {
			if ($routeParams.task) {
				$scope.task = Task.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					task: $routeParams.task
				})}

		};
		
		$scope.update();
		
		console.log($routeParams.task);
	
	}]);
