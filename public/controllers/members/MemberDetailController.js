/* global angular, alert */

angular.module('levelPad').controller('MemberDetailController', [
	'$scope', '$routeParams', '$location', '$log', 'DialogService', 'Module', 'Subject', 'Member', 'CurrentModule', 'CurrentSubject', 'CurrentMember', 'ChartOption',
	function ($scope, $routeParams, $location, $log, DialogService, Module, Subject, Member, CurrentModule, CurrentSubject, CurrentMember, ChartOption) {

		'use strict';
		$scope.module = CurrentModule;
		$scope.subject = CurrentSubject;
		var relGrade = 0;
		var weightSum = 0;
		
		

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.update = function() {
			if ($routeParams.member) {
				$scope.member = Member.get({
					module: $routeParams.module,
					subject: $routeParams.subject,
					member: $routeParams.member
				}, function () {
					prepareMember();
				}
			)}
		};

		$scope.update();
		
		console.log('member:', $scope.member);
		console.log('Current module', CurrentModule);
		console.log('Current subject', CurrentSubject);

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
		
		//function relativeGrade(){
		//	angular.forEach($scope.subject.tasks, function(task) {
		//		weightSum += task.weight;
		//	}
			
		//	return relGrade
		//};
		
		function prepareMember() {
			console.log($scope.member);
			console.log($scope.subject);
			
			
			$scope.member._artefacts = [
				{
					title:'Artefakte',
					value: $scope.member.evaluations.length,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.subject.tasks.length - $scope.member.evaluations.length,
					color:'lightgray',
					highlight: 'lightgray'
				}
			];
			$scope.member.relGrade = [
				{
					title:'Note',
					value: 2,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: 5 - 2,
					color:'lightgray',
					highlight: 'lightgray'
				}
			];
			
			angular.forEach($scope.subject.tasks, function(task) {
				task._taskWeight = [
				{
					title:'Task',
					value: task.weight,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: 100- task.weight,
					color:'lightgray',
					highlight: 'lightgray'
				}
			];
			});
		}

	}]);
