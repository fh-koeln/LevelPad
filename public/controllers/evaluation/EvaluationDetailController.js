/* global angular, alert */

angular.module('levelPad').controller('EvaluationDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, CurrentTask ) {
		
		'use strict';
		
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		$scope.showComments = 0;
		
		$scope.member = [
			{
			name: 'Peeta'
			}
		];
		
		$scope.update = function () {

		};
		
		$scope.update();
	
	}]);
