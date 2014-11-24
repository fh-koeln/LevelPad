/* global angular, alert */

angular.module('levelPad').controller('MemberListController', [
	'$scope', '$routeParams', '$location', '$log', 'Module', 'Subject', 'Task', 'DialogService', 'CurrentModule', 'CurrentSubject', 'CurrentTask', 'CurrentMember', 'ChartOption',
	function ($scope, $routeParams, $location, $log, Module, Subject, Task, DialogService, CurrentModule, CurrentSubject, CurrentTask, CurrentMember, ChartOption) {
		
		'use strict';
		
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		$scope.task = CurrentTask;
		$scope.member = CurrentMember;
		

		console.log('Current module', CurrentModule);
		console.log('Current subject', CurrentSubject);


		$scope.showEditDialog = function(member) {
			$scope.member = angular.copy(member);
			$('#edit').modal();
		};

		$scope.showDeleteDialog = function(member) {
			$scope.member = angular.copy(member);
			$('#delete').modal();
		};    
		
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
		
		$scope.member = [
		{
			name: 'Peeta'
		}
		];
		
		$scope.update = function() {

		};
		
		$scope.update();
	
	}]);
